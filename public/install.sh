#!/usr/bin/env sh
# Bnlang installer for Linux and macOS.
#
# Usage:
#   curl -fsSL https://bnlang.dev/install.sh | sh
#   curl -fsSL https://bnlang.dev/install.sh | sh -s -- v1.0.0
#
# When run as root (or via sudo), Bnlang installs system-wide to
# /usr/local/bin (which is already on PATH for all users). Otherwise it
# installs into the invoking user's $HOME/.bnlang/bin and adds that
# directory to PATH via the user's shell rc file.
#
# Environment overrides:
#   BNL_VERSION       version to install (default: latest stable from GitHub)
#   BNL_INSTALL_DIR   install location
#                     default (root):     /usr/local/bin
#                     default (non-root): $HOME/.bnlang/bin

set -e

BNL_VERSION="${BNL_VERSION:-${1:-}}"
REPO="bnlang/bnl-release"

# --- detect privilege ---
# `id -u` is POSIX; 0 == root.
if [ "$(id -u 2>/dev/null || echo 1000)" = "0" ]; then
    is_root=1
else
    is_root=0
fi

if [ -n "$BNL_INSTALL_DIR" ]; then
    INSTALL_DIR="$BNL_INSTALL_DIR"
elif [ "$is_root" = "1" ]; then
    INSTALL_DIR="/usr/local/bin"
else
    INSTALL_DIR="$HOME/.bnlang/bin"
fi

# --- detect OS ---
os_raw="$(uname -s)"
case "$os_raw" in
    Linux)  os="linux" ;;
    Darwin) os="macos" ;;
    *)
        echo "error: unsupported operating system: $os_raw" >&2
        echo "       Bnlang supports Linux, macOS, and Windows." >&2
        exit 1
        ;;
esac

# --- detect architecture ---
arch_raw="$(uname -m)"
case "$arch_raw" in
    x86_64|amd64)   arch="x64" ;;
    aarch64|arm64)  arch="arm64" ;;
    i386|i686)      arch="x86" ;;
    *)
        echo "error: unsupported architecture: $arch_raw" >&2
        exit 1
        ;;
esac

# --- pick a downloader ---
if command -v curl >/dev/null 2>&1; then
    download() { curl -fsSL "$1" -o "$2"; }
    headers()  { curl -fsSLI "$1"; }
elif command -v wget >/dev/null 2>&1; then
    download() { wget -q "$1" -O "$2"; }
    headers()  { wget -qS --spider "$1" 2>&1; }
else
    echo "error: need 'curl' or 'wget' to download Bnlang." >&2
    exit 1
fi

# --- resolve latest version (if not pinned) by following the GitHub
#     `/releases/latest` redirect to its versioned tag URL ---
if [ -z "$BNL_VERSION" ]; then
    if command -v curl >/dev/null 2>&1; then
        final="$(curl -fsSLI -o /dev/null -w '%{url_effective}' \
                 "https://github.com/${REPO}/releases/latest")"
    else
        final="$(wget --max-redirect=10 -qS --spider \
                 "https://github.com/${REPO}/releases/latest" 2>&1 \
                 | awk '/^Location: /{u=$2} END{print u}')"
    fi
    BNL_VERSION="${final##*/}"
fi

if [ -z "$BNL_VERSION" ] || [ "$BNL_VERSION" = "latest" ]; then
    echo "error: could not resolve the latest Bnlang version." >&2
    echo "       Pass an explicit version, e.g. 'sh -s -- v1.0.0'." >&2
    exit 1
fi

platform="${os}-${arch}"
stem="bnlang-${platform}-${BNL_VERSION}"
archive="${stem}.tar.gz"
url="https://github.com/${REPO}/releases/download/${BNL_VERSION}/${archive}"

echo "Installing Bnlang ${BNL_VERSION} for ${platform}"

# --- require tar ---
if ! command -v tar >/dev/null 2>&1; then
    echo "error: 'tar' is required but was not found." >&2
    exit 1
fi

tmp="$(mktemp -d 2>/dev/null || mktemp -d -t bnlang)"
trap 'rm -rf "$tmp"' EXIT INT TERM

echo "Downloading $url"
if ! download "$url" "$tmp/$archive"; then
    echo "error: download failed. Verify that version '$BNL_VERSION' exists at" >&2
    echo "       https://github.com/${REPO}/releases" >&2
    exit 1
fi

echo "Unpacking..."
# Archives are flat (files at the root), so extract into a clean subdir
# rather than into $tmp itself (which already holds the downloaded .tar.gz).
src="$tmp/extract"
mkdir -p "$src"
tar -xzf "$tmp/$archive" -C "$src"

if [ ! -f "$src/bnl" ]; then
    echo "error: archive did not contain a 'bnl' binary at $src/bnl." >&2
    exit 1
fi

mkdir -p "$INSTALL_DIR"
mv -f "$src/bnl" "$INSTALL_DIR/bnl"
chmod +x "$INSTALL_DIR/bnl"
# Copy LICENSE.txt + README.txt alongside the binary if the archive ships them.
for f in LICENSE.txt README.txt; do
    if [ -f "$src/$f" ]; then
        cp -f "$src/$f" "$INSTALL_DIR/$f"
    fi
done
echo "Installed bnl to $INSTALL_DIR"

# --- wire up PATH ---
# Skip PATH wire-up if the install dir is already on PATH, or if we did a
# root install to a default system location (already on every user's PATH).
case ":$PATH:" in
    *":$INSTALL_DIR:"*) path_already_set=1 ;;
    *)                  path_already_set=0 ;;
esac

if [ "$path_already_set" -eq 0 ] && { [ "$is_root" != "1" ] || [ -n "$BNL_INSTALL_DIR" ]; }; then
    shell_name="$(basename "${SHELL:-/bin/sh}")"
    case "$shell_name" in
        zsh)
            rc="$HOME/.zshrc"
            ;;
        bash)
            if [ "$os" = "macos" ] && [ -f "$HOME/.bash_profile" ]; then
                rc="$HOME/.bash_profile"
            else
                rc="$HOME/.bashrc"
            fi
            ;;
        fish)
            rc="$HOME/.config/fish/config.fish"
            mkdir -p "$(dirname "$rc")"
            ;;
        *)
            rc="$HOME/.profile"
            ;;
    esac

    if [ "$shell_name" = "fish" ]; then
        line="fish_add_path \"$INSTALL_DIR\""
    else
        line="export PATH=\"$INSTALL_DIR:\$PATH\""
    fi

    if [ -f "$rc" ] && grep -Fqs "$INSTALL_DIR" "$rc"; then
        :
    else
        printf '\n# bnlang\n%s\n' "$line" >> "$rc"
        echo "Added $INSTALL_DIR to PATH in $rc"
        echo "Open a new shell, or run: source \"$rc\""
    fi
elif [ "$path_already_set" -eq 0 ]; then
    # Root install to system location — already on PATH for everyone.
    path_already_set=1
fi

echo
echo "Done. Verify with:"
echo "    bnl --version"
if [ "${path_already_set:-0}" -eq 0 ]; then
    echo "(After opening a new shell, or directly: $INSTALL_DIR/bnl --version)"
fi
