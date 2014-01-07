#!/bin/bash

set -e

ABSPATH="$(cd "$(dirname "$0")"; pwd)"

USERSCRIPT="$ABSPATH/userscript/die2nite_enhancer.user.js"
ICON_DIR="$ABSPATH/icons"
OUTPUT_DIR="$ABSPATH/build"

PEM="$HOME/.pem/die2nite_enhancer.pem"
CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'


# Init the compilation
function init()
{
  # Create the output directory
  rm -rf "$OUTPUT_DIR"
  mkdir -p "$OUTPUT_DIR"
}

# Build the Google Chrome extension
function compile_chrome_ext()
{
  chrome_source_dir="$ABSPATH/chrome"
  chrome_build_dir="$OUTPUT_DIR/chrome"
  chrome_ext="$OUTPUT_DIR/chrome.zip"

  # Gather sources
  cp -r "$chrome_source_dir" "$chrome_build_dir"
  cp "$ICON_DIR"/icon{48,128}.png "$chrome_build_dir"
  cp "$USERSCRIPT" "$chrome_build_dir"

  # Create the zip and clean
  find "$chrome_build_dir" | zip -j "$chrome_ext" -@
  rm -rf "$chrome_build_dir"

  echo '-- Google Chrome extension zipped!'
}

# Build the Opera extension
function compile_opera_ext()
{
  opera_source_dir="$ABSPATH/opera"
  opera_build_dir="$OUTPUT_DIR/opera"

  # Gather sources
  cp -r "$opera_source_dir" "$opera_build_dir"
  cp "$ICON_DIR"/icon{48,128}.png "$opera_build_dir"
  cp "$USERSCRIPT" "$opera_build_dir"

  # Compile and clean
  "$CHROME" --pack-extension="$opera_build_dir" --pack-extension-key="$PEM"
  mv "$OUTPUT_DIR"/opera.{crx,nex}
  rm -rf "$opera_build_dir"

  echo '-- Opera extension compiled!'
}


init
compile_chrome_ext
compile_opera_ext

exit 0
