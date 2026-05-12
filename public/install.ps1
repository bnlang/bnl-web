# Bnlang installer for Windows.
#
# Usage (run from an elevated PowerShell -- the default install location is
# under Program Files and requires Administrator):
#   irm https://bnlang.dev/install.ps1 | iex
#
# Pin a version:
#   $env:BNL_VERSION = "v1.0.0"; irm https://bnlang.dev/install.ps1 | iex
#
# Environment overrides:
#   BNL_VERSION       version to install (default: latest stable from GitHub)
#   BNL_INSTALL_DIR   install location
#                     default x64: %ProgramFiles%\Bnlang
#                     default x86: %ProgramFiles(x86)%\Bnlang
#                     If you override to a user-writable path you can run
#                     without Administrator.

$ErrorActionPreference = "Stop"

$Version = if ($env:BNL_VERSION) { $env:BNL_VERSION } else { "" }
$Repo    = "bnlang/bnl-release"

# --- detect architecture ---
# PROCESSOR_ARCHITEW6432 is set when running under WOW64 and holds the real OS arch.
$archRaw = if ($env:PROCESSOR_ARCHITEW6432) { $env:PROCESSOR_ARCHITEW6432 } else { $env:PROCESSOR_ARCHITECTURE }

switch ($archRaw.ToUpper()) {
    "AMD64" { $arch = "x64" }
    "X86"   { $arch = "x86" }
    "ARM64" { $arch = "x64" }  # no native arm64 build yet; Windows on ARM emulates x64
    default {
        Write-Error "Unsupported architecture: $archRaw"
        exit 1
    }
}

$platform = "windows-$arch"

# --- resolve install directory ---
# Default: Program Files\Bnlang for x64, Program Files (x86)\Bnlang for x86.
# Honour BNL_INSTALL_DIR if the caller set it. Note ${env:ProgramFiles(x86)}
# uses ${} so PowerShell does not parse the parentheses as a subexpression.
if ($env:BNL_INSTALL_DIR) {
    $InstallDir = $env:BNL_INSTALL_DIR
} else {
    $progFiles = if ($arch -eq "x86") {
        if (${env:ProgramFiles(x86)}) { ${env:ProgramFiles(x86)} } else { "C:\Program Files (x86)" }
    } else {
        if ($env:ProgramFiles)        { $env:ProgramFiles }        else { "C:\Program Files" }
    }
    $InstallDir = Join-Path $progFiles "Bnlang"
}

# --- elevation check ---
# Writing under Program Files (and updating Machine PATH) needs admin.
# A user-writable BNL_INSTALL_DIR override doesn't, so only error when the
# chosen location actually requires it.
$isAdmin = ([Security.Principal.WindowsPrincipal] `
    [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
        [Security.Principal.WindowsBuiltInRole]::Administrator)

$pf64 = if ($env:ProgramFiles)        { $env:ProgramFiles }        else { "C:\Program Files" }
$pf86 = if (${env:ProgramFiles(x86)}) { ${env:ProgramFiles(x86)} } else { "C:\Program Files (x86)" }
$needsAdmin = $InstallDir.StartsWith($pf64, [StringComparison]::OrdinalIgnoreCase) -or `
              $InstallDir.StartsWith($pf86, [StringComparison]::OrdinalIgnoreCase)

if ($needsAdmin -and -not $isAdmin) {
    Write-Error ("Installing to '$InstallDir' requires Administrator.`n" +
                 "Re-open PowerShell as Administrator and run:`n" +
                 "    irm https://bnlang.dev/install.ps1 | iex`n" +
                 "Or override to a user-writable path, e.g.:`n" +
                 "    `$env:BNL_INSTALL_DIR = `"`$env:LOCALAPPDATA\Programs\Bnlang`"`n" +
                 "    irm https://bnlang.dev/install.ps1 | iex")
    exit 1
}

# TLS 1.2 for older Windows PowerShell that still defaults to TLS 1.0.
try {
    [Net.ServicePointManager]::SecurityProtocol =
        [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
} catch {}

# --- resolve latest version (if not pinned) by following the GitHub
#     `/releases/latest` redirect to its versioned tag URL ---
if (-not $Version) {
    try {
        $res = Invoke-WebRequest -Uri "https://github.com/$Repo/releases/latest" `
                                 -Method Head -MaximumRedirection 5 -UseBasicParsing
        $finalUri = $res.BaseResponse.ResponseUri.AbsoluteUri
        $Version  = ($finalUri -split '/')[-1]
    } catch {
        Write-Error "Could not resolve the latest Bnlang version. Pass an explicit version via `$env:BNL_VERSION = 'v1.0.0'`."
        exit 1
    }
}

if (-not $Version -or $Version -eq "latest") {
    Write-Error "Could not resolve the latest Bnlang version. Pass an explicit version via `$env:BNL_VERSION = 'v1.0.0'`."
    exit 1
}

$stem    = "bnlang-$platform-$Version"
$archive = "$stem.zip"
$url     = "https://github.com/$Repo/releases/download/$Version/$archive"

Write-Host "Installing Bnlang $Version for $platform"

$tmpRoot = Join-Path ([IO.Path]::GetTempPath()) ("bnlang-install-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $tmpRoot | Out-Null

try {
    $zipPath = Join-Path $tmpRoot $archive

    Write-Host "Downloading $url"
    try {
        Invoke-WebRequest -Uri $url -OutFile $zipPath -UseBasicParsing
    } catch {
        Write-Error ("Download failed. Verify that version '$Version' exists at " +
                     "https://github.com/$Repo/releases`n  $($_.Exception.Message)")
        exit 1
    }

    Write-Host "Unpacking..."
    # Archives are flat (files at the root), so extract into a clean subdir
    # rather than into $tmpRoot itself (which already holds the downloaded .zip).
    $src = Join-Path $tmpRoot "extract"
    New-Item -ItemType Directory -Force -Path $src | Out-Null
    Expand-Archive -Path $zipPath -DestinationPath $src -Force

    $bnl = Join-Path $src "bnl.exe"
    if (-not (Test-Path $bnl)) {
        Write-Error "Archive did not contain a 'bnl.exe' binary at $bnl."
        exit 1
    }

    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
    Copy-Item -Force $bnl (Join-Path $InstallDir "bnl.exe")
    # Copy LICENSE.txt + README.txt alongside the binary if the archive ships them.
    foreach ($name in @("LICENSE.txt", "README.txt")) {
        $f = Join-Path $src $name
        if (Test-Path $f) {
            Copy-Item -Force $f (Join-Path $InstallDir $name)
        }
    }
    Write-Host "Installed bnl to $InstallDir"

    # --- add to PATH if missing ---
    # System-wide install (Program Files) uses Machine PATH so every user
    # picks it up. User-writable override uses User PATH so admin isn't
    # needed.
    $pathScope = if ($needsAdmin) { "Machine" } else { "User" }
    $existing  = [Environment]::GetEnvironmentVariable("Path", $pathScope)
    $alreadyOnPath = $false
    if ($existing) {
        foreach ($p in $existing -split ';') {
            if ($p.Trim().TrimEnd('\') -ieq $InstallDir.TrimEnd('\')) {
                $alreadyOnPath = $true
                break
            }
        }
    }

    if (-not $alreadyOnPath) {
        $newPath = if ([string]::IsNullOrEmpty($existing)) { $InstallDir } else { "$existing;$InstallDir" }
        [Environment]::SetEnvironmentVariable("Path", $newPath, $pathScope)
        Write-Host "Added $InstallDir to the $pathScope PATH."
        Write-Host "Open a new terminal for it to take effect."
    }

    # Make it usable in the current session too.
    if (-not (($env:Path -split ';') -contains $InstallDir)) {
        $env:Path = "$env:Path;$InstallDir"
    }
}
finally {
    Remove-Item -Recurse -Force $tmpRoot -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Done. Verify with:"
Write-Host "    bnl --version"
