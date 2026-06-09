#!/usr/bin/env bash
set -eu

# CONFIG
REPO_SLUG="tradingview/charting_library"
COMMIT="bff3af11c0fd6eabae559fc1482a3c85e2ef06f0"
REPO_HTTPS="https://github.com/${REPO_SLUG}.git"

# Functions
remove_if_directory_exists() { if [ -d "$1" ]; then rm -rf "$1"; fi; }
create_if_directory_does_not_exists() { if [ ! -d "$1" ]; then mkdir -p "$1"; fi; }

# Authenticated URL if TRADING_VIEW_GH_READ_TOKEN is set
if [ "${TRADING_VIEW_GH_READ_TOKEN:-}" != "" ]; then
  AUTH_URL="https://oauth2:${TRADING_VIEW_GH_READ_TOKEN}@github.com/${REPO_SLUG}.git"
else
  AUTH_URL="$REPO_HTTPS"
fi

if [[ "$AUTH_URL" != *"oauth2"* ]]; then
  echo "Error: AUTH_URL is not using TRADING_VIEW_GH_READ_TOKEN. Run 'export TRADING_VIEW_GH_READ_TOKEN=<your_token>' to allow the script to read the variable. Exiting." >&2
  exit 1
fi

TMP_DIR="$(mktemp -d)"

# Fetch the exact commit instead of master
git init -q "$TMP_DIR"
git -C "$TMP_DIR" remote add origin "$AUTH_URL"
git -C "$TMP_DIR" fetch -q --depth 1 origin "$COMMIT"
git -C "$TMP_DIR" checkout -q FETCH_HEAD

create_if_directory_does_not_exists "public/trading-view"

remove_if_directory_exists "public/trading-view/charting_library"
remove_if_directory_exists "public/trading-view/datafeeds"

if [ -d "${TMP_DIR}/charting_library" ]; then
  cp -R "${TMP_DIR}/charting_library" "public/trading-view/"
else
  echo "Expected folder 'charting_library' not found in repo" >&2
  rm -rf "$TMP_DIR"
  exit 1
fi

if [ -d "${TMP_DIR}/datafeeds" ]; then
  cp -R "${TMP_DIR}/datafeeds" "public/trading-view/"
fi

rm -rf "$TMP_DIR"

if [ "${TRADING_VIEW_GH_READ_TOKEN:-}" != "" ]; then
  unset TRADING_VIEW_GH_READ_TOKEN
fi

echo "TradingView Charting Library assets copied to public/trading-view at commit ${COMMIT}."