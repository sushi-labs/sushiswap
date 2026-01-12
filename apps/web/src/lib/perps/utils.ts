export const getTextColorClass = (value: number) => {
  if (value >= 0) return 'text-green'
  if (value < 0) return 'text-red'
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
})

export const getHyperliquidExplorerUrl = (type: 'token', address: string) => {
  const base = 'https://app.hyperliquid.xyz/explorer/'
  //add switch case for other types if needed in future
  return `${base}${type}/${address}`
}
