#!/usr/bin/env node

if (!process.env.TRADING_VIEW_GH_READ_TOKEN) {
  console.error('TRADING_VIEW_GH_READ_TOKEN is required')
  process.exit(1)
}
