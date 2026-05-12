# Bnlang installer for Windows.
#
# Usage:
#   irm https://bnlang.dev/install.ps1 | iex
#
# Pin a version:
#   $env:BNL_VERSION = "v1.0.0"; irm https://bnlang.dev/install.ps1 | iex
#
# Environment overrides:
#   BNL_VERSION       version to install (default: latest stable from GitHub)
#   BNL_INSTALL_DIR   install location  (default: %USERPROFILE%\.bnlang\bin)

$ErrorActionPreference = "Stop"

$Version    = if ($env:BNL_VERSION)     { $env:BNL_VERSION }     else { "" }
$InstallDir = if ($env:BNL_INSTALL_DIR) { $env:BNL_INSTALL_DIR } else { Join-Path $env:USERPROFILE ".bnlang\bin" }
$Repo       = "bnlang/bnl-release"

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

    # --- add to user PATH if missing ---
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $alreadyOnPath = $false
    if ($userPath) {
        foreach ($p in $userPath -split ';') {
            if ($p.Trim().TrimEnd('\') -ieq $InstallDir.TrimEnd('\')) {
                $alreadyOnPath = $true
                break
            }
        }
    }

    if (-not $alreadyOnPath) {
        $newPath = if ([string]::IsNullOrEmpty($userPath)) { $InstallDir } else { "$userPath;$InstallDir" }
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        Write-Host "Added $InstallDir to your user PATH."
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
