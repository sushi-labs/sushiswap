export const getTextColorClass = (value: number) => {
  if (value >= 0) return 'text-green dark:text-green-500'
  if (value < 0) return 'text-red dark:text-red-500'
  return ''
}

export const getSignForValue = (value: number) => {
  if (value >= 0) return '+'
  return ''
}

export const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export const enUSFormatNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})
export const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 8,
  minimumFractionDigits: 0,
})

export const getHyperliquidExplorerUrl = (
  type: 'token' | 'txn',
  value: string,
) => {
  const base = 'https://app.hyperliquid.xyz/explorer/'

  switch (type) {
    case 'token':
      return `${base}asset/${value}`
    case 'txn':
      return `${base}tx/${value}`
    default:
      throw new Error('Invalid type for explorer URL')
  }
}

export const SPOT_ASSETS_TO_REWRITE = new Map<string, string>([
  ['UBTC', 'BTC'],
  ['UETH', 'ETH'],
  ['USOL', 'SOL'],
  ['UPUMP', 'PUMP'],
  ['UFART', 'FART'],
  ['UMON', 'MON'],
  ['UXPL', 'XPL'],
  ['UENA', 'ENA'],
  ['UUUSPX', 'SPX'],
  ['HPENGU', 'PENGU'],
  ['HFUN', 'FUN'],
  ['UBONK', 'BONK'],
  ['HREKT', 'REKT'],
  ['HWAVE', 'WAVE'],
  ['USPYX', 'SPYX'],
])

export const toFixedTrim = (x: number, maxDp = 10) => {
  // stable display, no trailing zeros
  const s = x.toFixed(maxDp)
  return s.replace(/\.?0+$/, '')
}
