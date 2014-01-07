#!/bin/sh

# Abort on error
set -e

# Configuration
ABSPATH=$(cd "$(dirname "$0")"; pwd)
OUTPUT_DIR="$ABSPATH/build"
BASE_USERSCRIPT="$ABSPATH/userscript/die2nite_enhancer.user.js"

# Init the compilation
function init()
{
  # Create the output directory
  rm -rf "$OUTPUT_DIR"
  mkdir -p "$OUTPUT_DIR"
}

# Build the chrome extension
function compile_chrome()
{
  chrome_source_dir="$ABSPATH/chrome"
  chrome_build_dir="$OUTPUT_DIR/chrome"
  cp -r "$chrome_source_dir" "$chrome_build_dir"
  cp "$BASE_USERSCRIPT" "$chrome_build_dir"
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension="$chrome_build_dir" --pack-extension-key="$HOME/.pem/die2nite_enhancer.pem"
  rm -rf "$chrome_build_dir"
  echo '-- Chrome extension compiled!'
}

init
compile_chrome

exit 0
