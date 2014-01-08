#!/bin/sh

# Placeholders
PLACEHOLDERS=(
  '__AUTHOR_NAME__=Aymeric Beaumet'
  '__AUTHOR_EMAIL__=aymeric@beaumet.me'
  '__AUTHOR_WEBSITE__=beaumet.me'
  '__ID__=die2nite_enhancer'
  '__NAME__=Die2Nite Enhancer'
  '__DESCRIPTION__=Die2Nite Enhancer is an extension allowing you to improve your game experience on the browser game Die2Nite.'
  '__VERSION__=0.0.2'
  '__LICENSE__=zlib/libpng'
  '__LICENSE_URL__=http://opensource.org/licenses/Zlib'
  '__MATCHING_URL_JSON_ARRAY__=["__MATCHING_URL_1__","__MATCHING_URL_2__","__MATCHING_URL_3__","__MATCHING_URL_4__"]'
  '__MATCHING_URL_1__=http://www.die2nite.com/*'
  '__MATCHING_URL_2__=http://www.hordes.fr/*'
  '__MATCHING_URL_3__=http://www.zombinoia.com/*'
  '__MATCHING_URL_4__=http://www.dieverdammten.de/*'
  '__CROSS_ORIGIN_XHR_PERMISSION_JSON_ARRAY__=["__CROSS_ORIGIN_XHR_PERMISSION_1__","__CROSS_ORIGIN_XHR_PERMISSION_2__"]'
  '__CROSS_ORIGIN_XHR_PERMISSION_1__=http://bbh.fred26.fr/'
  '__CROSS_ORIGIN_XHR_PERMISSION_2__=http://www.oeev-hordes.com/'
  '__PROJECT_WEBSITE__=https://github.com/abeaumet/die2nite_enhancer'
  '__PROJECT_BUGTRACKER__=https://github.com/abeaumet/die2nite_enhancer/issues'
  '__USERSCRIPT_DOWNLOAD_URL__=https://github.com/abeaumet/die2nite_enhancer/raw/master/die2nite_enhancer.user.js'
  '__USERSCRIPT_ICON__=http://www.zombinoia.com/gfx/forum/smiley/h_city_up.gif'
)

# Paths
ABSPATH="$(cd "$(dirname "$0")"; pwd)"
USERSCRIPT="$ABSPATH/userscript/die2nite_enhancer.user.js"
ICON_DIR="$ABSPATH/icons"
OUTPUT_DIR="$ABSPATH/build"

# OS Path
PEM="$HOME/.pem/die2nite_enhancer.pem"
CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
CFX="$HOME/bin/cfx"


set -e


# Fix error -> "sed: RE error: illegal byte sequence"
# Link: http://stackoverflow.com/a/19770395/1071486
export LC_CTYPE=C
export LANG=C

# Replace placeholders in all the files at the given path (recursively)
# $1 the folder where to replace placeholders
function _replace_placeholders()
{
  files="$(find "$1" -type f)"

  for placeholder in ${!PLACEHOLDERS[*]} ; do
    sed -i '' -e "s=${PLACEHOLDERS[$placeholder]}=g" $files
  done
}

# Init the compilation
function init()
{
  # Create the output directory
  rm -rf "$OUTPUT_DIR"
  mkdir -p "$OUTPUT_DIR"
}

# Build the user script
function compile_user_script()
{
  userscript_source_dir="$ABSPATH/userscript"
  userscript_build_dir="$OUTPUT_DIR/userscript"
  userscript_ext="$OUTPUT_DIR/userscript.user.js"

  # Gather sources
  cp -r "$userscript_source_dir" "$userscript_build_dir"

  # Replace placeholders
  _replace_placeholders "$userscript_build_dir"

  # Grab userscript
  mv "$userscript_build_dir/die2nite_enhancer.user.js" "$userscript_ext"

  # Clean and notify
  rm -rf "$userscript_build_dir"
  echo '-- User script done!'
}

# Build the Chrome extension
function compile_chrome_ext()
{
  chrome_source_dir="$ABSPATH/chrome"
  chrome_build_dir="$OUTPUT_DIR/chrome"
  chrome_ext="$OUTPUT_DIR/chrome.crx"
  chrome_zip="$OUTPUT_DIR/chrome.zip"

  # Gather sources
  cp -r "$chrome_source_dir" "$chrome_build_dir"
  cp "$ICON_DIR"/icon{48,128}.png "$chrome_build_dir"
  cp "$USERSCRIPT" "$chrome_build_dir"

  # Replace placeholders
  _replace_placeholders "$chrome_build_dir"

  # Package the extension
  "$CHROME" --pack-extension="$chrome_build_dir" --pack-extension-key="$PEM"

  # Zip the extension
  find "$chrome_build_dir" | zip -j "$chrome_zip" -@

  # Clean and notify
  rm -rf "$chrome_build_dir"
  echo '-- Chrome extension done!'
}

# Build the Firefox extension
function compile_firefox_ext()
{
  firefox_source_dir="$ABSPATH/firefox"
  firefox_build_dir="$OUTPUT_DIR/firefox"
  firefox_ext="$OUTPUT_DIR/firefox.xpi"

  # Gather sources
  cp -r "$firefox_source_dir" "$firefox_build_dir"
  mkdir "$firefox_build_dir/data"
  cp "$USERSCRIPT" "$firefox_build_dir/data"

  # Replace placeholders
  _replace_placeholders "$firefox_build_dir"

  # Package the extension
  cd "$firefox_build_dir" && "$CFX" xpi --output-file="$firefox_ext"

  # Clean and notify
  rm -rf "$firefox_build_dir"
  echo '-- Firefox extension done!'
}

# Build the Opera extension
function compile_opera_ext()
{
  opera_source_dir="$ABSPATH/opera"
  opera_build_dir="$OUTPUT_DIR/opera"
  opera_ext="$OUTPUT_DIR/opera.nex"

  # Gather sources
  cp -r "$opera_source_dir" "$opera_build_dir"
  cp "$ICON_DIR"/icon{48,128}.png "$opera_build_dir"
  cp "$USERSCRIPT" "$opera_build_dir"

  # Replace placeholders
  _replace_placeholders "$opera_build_dir"

  # Package the extension
  "$CHROME" --pack-extension="$opera_build_dir" --pack-extension-key="$PEM"
  mv "$OUTPUT_DIR"/opera.crx "$opera_ext"

  # Clean and notify
  rm -rf "$opera_build_dir"
  echo '-- Opera extension done!'
}


init
compile_user_script
compile_chrome_ext
compile_firefox_ext
#compile_safari_ext
compile_opera_ext

exit 0
