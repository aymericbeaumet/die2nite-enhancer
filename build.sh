#!/bin/bash

# Placeholders
PLACEHOLDERS=(
  '__AUTHOR_NAME__=Aymeric Beaumet'
  '__AUTHOR_EMAIL__=aymeric@beaumet.me'
  '__AUTHOR_WEBSITE__=beaumet.me'
  '__ID__=die2nite_enhancer'
  '__NAME__=Die2Nite Enhancer'
  '__SHORT_NAME__=D2NE'
  '__DESCRIPTION__=Die2Nite Enhancer is an extension allowing you to improve your game experience on the browser game Die2Nite.'
  '__VERSION__=0.0.2'
  '__LICENSE__=zlib/libpng'
  '__LICENSE_URL__=http://opensource.org/licenses/Zlib'
  '__MATCHING_URL_JSON_ARRAY__=["http://__MATCHING_URL_1__/*","http://__MATCHING_URL_2__/*","http://__MATCHING_URL_3__/*","http://__MATCHING_URL_4__/*"]'
  '__MATCHING_URL_1__=www.die2nite.com'
  '__MATCHING_URL_2__=www.hordes.fr'
  '__MATCHING_URL_3__=www.zombinoia.com'
  '__MATCHING_URL_4__=www.dieverdammten.de'
  '__CROSS_ORIGIN_XHR_PERMISSION_JSON_ARRAY__=["http://__CROSS_ORIGIN_XHR_PERMISSION_1__/","http://__CROSS_ORIGIN_XHR_PERMISSION_2__/"]'
  '__CROSS_ORIGIN_XHR_PERMISSION_1__=bbh.fred26.fr'
  '__CROSS_ORIGIN_XHR_PERMISSION_2__=www.oeev-hordes.com'
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

# Softwares/Certs Path
CHROME_PEM="$HOME/.d2ne/chrome.pem" # Generated by Chrome the first time
SAFARI_CERT_DIR="$HOME/.d2ne/safari" # http://developer.streak.com/2013/01/how-to-build-safari-extension-using.html
CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
CFX="$HOME/bin/cfx" # https://ftp.mozilla.org/pub/mozilla.org/labs/jetpack/jetpack-sdk-latest.zip
XAR="$HOME/bin/xar" # https://github.com/downloads/mackyle/xar/xar-1.6.1.tar.gz
ZIP='zip' # Must support -j and -@


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
  "$CHROME" --pack-extension="$chrome_build_dir" --pack-extension-key="$CHROME_PEM"

  # Zip the extension
  find "$chrome_build_dir" | "$ZIP" -j "$chrome_zip" -@

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

# Build the Safari extension
function compile_safari_ext()
{
  safari_source_dir="$ABSPATH/safari"
  safari_build_dir="$OUTPUT_DIR/safari.safariextension"
  safari_ext="$OUTPUT_DIR/safari.safariextz"

  # Gather sources
  cp -r "$safari_source_dir" "$safari_build_dir"
  cp "$USERSCRIPT" "$safari_build_dir"

  # Replace placeholders
  _replace_placeholders "$safari_build_dir"

  # Package the extension
  digest_file="$safari_build_dir/digest.dat"
  sig_file="$safari_build_dir/sig.dat"
  cd "$safari_build_dir/.." && "$XAR" -czf "$safari_ext" --distribution "$(basename "$safari_build_dir")"
  "$XAR" --sign -f "$safari_ext" --digestinfo-to-sign "$digest_file" --sig-size "$(cat "$SAFARI_CERT_DIR/size")" --cert-loc "$SAFARI_CERT_DIR/cert.der" --cert-loc "$SAFARI_CERT_DIR/cert01" --cert-loc "$SAFARI_CERT_DIR/cert02"
  openssl rsautl -sign -inkey "$SAFARI_CERT_DIR/key.pem" -in "$digest_file" -out "$sig_file"
  "$XAR" --inject-sig "$sig_file" -f "$safari_ext"

  # Clean and notify
  rm -rf "$safari_build_dir"
  echo '-- Safari extension done!'
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
  "$CHROME" --pack-extension="$opera_build_dir" --pack-extension-key="$CHROME_PEM"
  mv "$OUTPUT_DIR"/opera.crx "$opera_ext"

  # Clean and notify
  rm -rf "$opera_build_dir"
  echo '-- Opera extension done!'
}


init
[[ "$1" =~ ^--all|--userscript$ ]] && compile_user_script
[[ "$1" =~ ^--all|--chrome$ ]] && compile_chrome_ext
[[ "$1" =~ ^--all|--firefox$ ]] && compile_firefox_ext
[[ "$1" =~ ^--all|--safari$ ]] && compile_safari_ext
[[ "$1" =~ ^--all|--opera$ ]] && compile_opera_ext

exit 0
