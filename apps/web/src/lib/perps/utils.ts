import { formatUnits, parseUnits } from 'viem'

export const getTextColorClass = (value: number) => {
  if (value >= 0) return 'text-green dark:text-green-500'
  if (value < 0) return 'text-red dark:text-red-500'
  return ''
}
export const getTextColorClassForHover = (value: number) => {
  if (value >= 0)
    return 'text-green-300 hover:text-green dark:text-green-200 hover:dark:text-green-500'
  if (value < 0)
    return 'text-red-300 hover:text-red dark:text-red-200 hover:dark:text-red-500'
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

export const getPerpsDexAndCoin = (coinString: string) => {
  if (coinString.includes('@')) {
    return { perpsDex: null, coin: coinString, type: 'spot' as const }
  }

  if (coinString.includes(':')) {
    const [perpsDex, coin] = coinString.split(':')
    return { perpsDex, coin, type: 'perp' as const }
  }
  return { perpsDex: null, coin: coinString, type: 'perp' as const }
}

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
  ['UFART', 'FARTCOIN'],
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

// Formula:
// liq_price = price - side * margin_available / position_size / (1 - l * side)
// where
// l = 1 / MAINTENANCE_LEVERAGE . For assets with margin tiers, maintenance leverage depends on the unique margin tier corresponding to the position value at the liquidation price.
// side = 1 for long and -1 for short
// margin_available (cross) = account_value - maintenance_margin_required
// margin_available (isolated) = isolated_margin - maintenance_margin_required
export const estimateLiquidationPrice = ({
  price,
  side,
  accountValue,
  isolatedMargin,
  maintenanceLeverage,
  maintenanceMarginRequired,
  positionSize,
  isCross,
}: {
  price: string
  side: 'A' | 'B'
  accountValue: string
  isolatedMargin: string
  maintenanceLeverage: string
  maintenanceMarginRequired: string
  positionSize: string
  isCross: boolean
}): string | null => {
  // Use a high internal scale for BigInt math to prevent precision loss
  const INTERNAL_PRECISION = 18n
  const SCALE = 10n ** INTERNAL_PRECISION

  const priceB = parseUnits(price, 18)
  const accountValueB = parseUnits(accountValue, 18)
  const isolatedMarginB = parseUnits(isolatedMargin, 18)
  const maintenanceMarginRequiredB = parseUnits(maintenanceMarginRequired, 18)
  const positionSizeB = parseUnits(positionSize, 18)

  // Long (B) = 1, Short (A) = -1
  const s = side === 'B' ? 1n : -1n

  const marginAvailableB = isCross
    ? accountValueB - maintenanceMarginRequiredB
    : isolatedMarginB - maintenanceMarginRequiredB

  // l = 1 / maintenanceLeverage
  const l_scaled = SCALE / BigInt(maintenanceLeverage)

  // Formula: price - (side * margin_available) / (pos_size * (1 - l * side))

  // 1. Calculate the denominator: (1 - l * side)
  const denominator = SCALE - l_scaled * s

  // 2. Calculate the fraction: (side * margin_available) / (pos_size * denominator / SCALE)
  // We multiply marginAvailable by SCALE first to maintain precision during BigInt division
  const numerator = s * marginAvailableB * SCALE
  const effectivePosSize = (positionSizeB * denominator) / SCALE

  const liqPriceB = priceB - numerator / effectivePosSize
  if (liqPriceB < 0n) {
    return null
  }

  return formatUnits(liqPriceB, 18)
}
