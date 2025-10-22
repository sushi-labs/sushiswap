#!/bin/sh
set -eu

# CONFIG
BRANCH="master"
REPO_SLUG="tradingview/charting_library"      
REPO_HTTPS="https://github.com/${REPO_SLUG}.git#semver:28.0.0"

# Functions
remove_if_directory_exists() { if [ -d "$1" ]; then rm -rf "$1"; fi; }
create_if_directory_does_not_exists() { if [ ! -d "$1" ]; then mkdir -p "$1"; fi; }

# Authenticated URL if GH_READ_TOKEN is set (Vercel build)
# Use oauth2 or x-access-token; both work for PATs
if [ "${GH_READ_TOKEN:-}" != "" ]; then
  AUTH_URL="https://oauth2:${GH_READ_TOKEN}@github.com/${REPO_SLUG}.git"
else
  AUTH_URL="$REPO_HTTPS"
fi

# if auth_url does not contain oauth2, throw error and exit
if [[ "$AUTH_URL" != *"oauth2"* ]]; then
  echo "Error: AUTH_URL is not using GH_READ_TOKEN. Run 'export GH_READ_TOKEN=<your_token>' to allow the script to read the variable. Exiting." >&2
  exit 1
fi
  
# Temp clone dir
TMP_DIR="$(mktemp -d)"

# Clone the repo (shallow) to temp dir
# - Non-interactive: token-in-URL avoids Git prompting (which fails on Vercel)
# - Quiet to reduce log noise (Vercel will still redact env vars)
git clone -q --depth 1 -b "$BRANCH" "$AUTH_URL" "$TMP_DIR"

# Ensure public/static exists
create_if_directory_does_not_exists "public/trading_view"

# Replace existing asset dirs
remove_if_directory_exists "public/trading_view/charting_library"
remove_if_directory_exists "public/trading_view/datafeeds"

# Copy what we need
if [ -d "${TMP_DIR}/charting_library" ]; then
  cp -R "${TMP_DIR}/charting_library" "public/trading_view/"
else
  echo "Expected folder 'charting_library' not found in repo" >&2
  rm -rf "$TMP_DIR"
  exit 1
fi

if [ -d "${TMP_DIR}/datafeeds" ]; then
  cp -R "${TMP_DIR}/datafeeds" "public/trading_view/"
fi

# Cleanup
rm -rf "$TMP_DIR"

# Extra hygiene: drop token from env for the rest of the build step
if [ "${GH_READ_TOKEN:-}" != "" ]; then
  unset GH_READ_TOKEN
fi

echo "TradingView Charting Library assets copied to public/trading_view."
