#!/bin/sh
# Compile assets/css/tailwind.css from index.html + tailwind.config.js (no Node needed).
set -e
cd "$(dirname "$0")"
TW=bin/tailwindcss
if [ ! -x "$TW" ]; then
  case "$(uname -s)-$(uname -m)" in
    Darwin-arm64) asset=tailwindcss-macos-arm64 ;;
    Darwin-x86_64) asset=tailwindcss-macos-x64 ;;
    Linux-x86_64) asset=tailwindcss-linux-x64 ;;
    Linux-aarch64) asset=tailwindcss-linux-arm64 ;;
    *) echo "Unsupported platform" >&2; exit 1 ;;
  esac
  mkdir -p bin
  curl -sSL -o "$TW" "https://github.com/tailwindlabs/tailwindcss/releases/download/v3.4.17/$asset"
  chmod +x "$TW"
fi
"$TW" -c tailwind.config.js -i src/tailwind.css -o assets/css/tailwind.css --minify "$@"
