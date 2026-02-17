import { formatUnits, parseUnits } from 'viem'
import type { UserOpenOrdersItemType } from './use-user-open-orders'

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

//Todo: move these math helpers to a separate file

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

export type Side = 'A' | 'B' // A = short, B = long

export type TpSlGainLossType = 'usd' | 'percent'

export type TpFromGainInput = {
  entryPrice: string
  positionSize: string
  side: Side
  leverage: bigint
  decimals: number
  gainType: TpSlGainLossType
  gainValue: string
}

export type TpFromGainResult = {
  tpPrice: string
  gainUsd: string
  gainPercent: string // ROE%
}

export type GainFromTpResult = {
  gainUsd: string
  gainPercent: string // ROE%
}

/**
 * TP + Gain from user input (USD profit or ROE%)
 */
export function calculateTpFromGain(input: TpFromGainInput): TpFromGainResult {
  const {
    entryPrice,
    positionSize,
    side,
    leverage,
    decimals,
    gainType,
    gainValue,
  } = input

  const d = BigInt(decimals)
  const SCALE = 10n ** d

  const entryPx = parseUnits(entryPrice, decimals)
  const sizeScaled = parseUnits(positionSize, decimals)

  if (entryPx <= 0n) throw new Error('entryPrice must be > 0')
  if (sizeScaled <= 0n) throw new Error('positionSize must be > 0')
  if (leverage <= 0n) throw new Error('leverage must be > 0')

  const entryNotionalUsd = (entryPx * sizeScaled) / SCALE
  if (entryNotionalUsd <= 0n) throw new Error('entryNotionalUsd must be > 0')

  const tpFromProfitUsd = (profitUsd: bigint) => {
    const priceDelta = (profitUsd * SCALE) / sizeScaled
    return side === 'A' ? entryPx - priceDelta : entryPx + priceDelta
  }

  const roeFromProfitUsd = (profitUsd: bigint) => {
    // ROE% = profit / (notional/leverage) * 100
    return (profitUsd * leverage * 100n * SCALE) / entryNotionalUsd
  }

  if (gainType === 'usd') {
    const profitUsd = parseUnits(gainValue, decimals)
    const tpPx = tpFromProfitUsd(profitUsd)
    const roeScaled = roeFromProfitUsd(profitUsd)

    return {
      tpPrice: formatUnits(tpPx, decimals),
      gainUsd: gainValue,
      gainPercent: formatUnits(roeScaled, decimals),
    }
  }

  // percent = ROE%
  const roePercentScaled = parseUnits(gainValue, decimals)
  const marginUsedUsd = entryNotionalUsd / leverage

  const profitUsd = (marginUsedUsd * roePercentScaled) / (100n * SCALE)
  const tpPx = tpFromProfitUsd(profitUsd)

  return {
    tpPrice: formatUnits(tpPx, decimals),
    gainUsd: formatUnits(profitUsd, decimals),
    gainPercent: gainValue,
  }
}

export type GainFromTpInput = {
  entryPrice: string
  positionSize: string
  tpPrice: string
  side: Side
  leverage: bigint
  decimals: number
}

/**
 * Gain (USD + ROE%) from a given TP price
 */
export function calculateGainFromTp(input: GainFromTpInput): GainFromTpResult {
  const { entryPrice, positionSize, tpPrice, side, leverage, decimals } = input

  const d = BigInt(decimals)
  const SCALE = 10n ** d

  const entryPx = parseUnits(entryPrice, decimals)
  const tpPx = parseUnits(tpPrice, decimals)
  const sizeScaled = parseUnits(positionSize, decimals)

  if (entryPx <= 0n) throw new Error('entryPrice must be > 0')
  if (tpPx <= 0n) throw new Error('tpPrice must be > 0')
  if (sizeScaled <= 0n) throw new Error('positionSize must be > 0')
  if (leverage <= 0n) throw new Error('leverage must be > 0')

  // priceDiff is positive when TP is profitable
  const priceDiff = side === 'A' ? entryPx - tpPx : tpPx - entryPx

  // profitUsd = priceDiff * size (scale back down once)
  const profitUsd = (priceDiff * sizeScaled) / SCALE

  const entryNotionalUsd = (entryPx * sizeScaled) / SCALE
  if (entryNotionalUsd <= 0n) throw new Error('entryNotionalUsd must be > 0')

  // ROE% (scaled by 10^decimals)
  const roePercentScaled =
    (profitUsd * leverage * 100n * SCALE) / entryNotionalUsd

  return {
    gainUsd: formatUnits(profitUsd, decimals),
    gainPercent: formatUnits(roePercentScaled, decimals),
  }
}

export type SlFromLossInput = {
  entryPrice: string
  positionSize: string
  side: Side
  leverage: bigint
  decimals: number
  lossType: 'usd' | 'percent' // percent = ROE%
  lossValue: string // USD loss or ROE% loss depending on lossType
}

export type SlFromLossResult = {
  slPrice: string
  lossUsd: string
  lossPercent: string // ROE%
}

export type LossFromSlInput = {
  entryPrice: string
  positionSize: string
  slPrice: string
  side: Side
  leverage: bigint
  decimals: number
}

export type LossFromSlResult = {
  lossUsd: string
  lossPercent: string // ROE%
}

/**
 * Stop-loss price + Loss from user input (USD loss or ROE% loss)
 *
 * Conventions:
 * - lossUsd is returned as a POSITIVE number string (magnitude of loss).
 * - lossPercent is ROE% (magnitude), POSITIVE.
 */
export function calculateSlFromLoss(input: SlFromLossInput): SlFromLossResult {
  const {
    entryPrice,
    positionSize,
    side,
    leverage,
    decimals,
    lossType,
    lossValue,
  } = input

  const d = BigInt(decimals)
  const SCALE = 10n ** d

  const entryPx = parseUnits(entryPrice, decimals)
  const sizeScaled = parseUnits(positionSize, decimals)

  if (entryPx <= 0n) throw new Error('entryPrice must be > 0')
  if (sizeScaled <= 0n) throw new Error('positionSize must be > 0')
  if (leverage <= 0n) throw new Error('leverage must be > 0')

  const entryNotionalUsd = (entryPx * sizeScaled) / SCALE
  if (entryNotionalUsd <= 0n) throw new Error('entryNotionalUsd must be > 0')

  // Helper: from lossUsd -> SL price
  // For a SHORT (A), loss occurs when price goes UP => SL above entry
  // For a LONG  (B), loss occurs when price goes DOWN => SL below entry
  const slFromLossUsd = (lossUsd: bigint) => {
    const priceDelta = (lossUsd * SCALE) / sizeScaled
    return side === 'A' ? entryPx + priceDelta : entryPx - priceDelta
  }

  // Helper: from lossUsd -> ROE% loss (scaled by 10^decimals)
  const roeFromLossUsd = (lossUsd: bigint) => {
    // ROE% = loss / (notional/leverage) * 100
    return (lossUsd * leverage * 100n * SCALE) / entryNotionalUsd
  }

  if (lossType === 'usd') {
    const lossUsd = parseUnits(lossValue, decimals)
    const slPx = slFromLossUsd(lossUsd)
    const roeScaled = roeFromLossUsd(lossUsd)

    return {
      slPrice: formatUnits(slPx, decimals),
      lossUsd: lossValue,
      lossPercent: formatUnits(roeScaled, decimals),
    }
  }

  // lossType === 'percent' (ROE% loss)
  const roePercentScaled = parseUnits(lossValue, decimals)

  const marginUsedUsd = entryNotionalUsd / leverage
  const lossUsd = (marginUsedUsd * roePercentScaled) / (100n * SCALE)

  const slPx = slFromLossUsd(lossUsd)

  return {
    slPrice: formatUnits(slPx, decimals),
    lossUsd: formatUnits(lossUsd, decimals),
    lossPercent: lossValue,
  }
}

/**
 * Loss (USD + ROE% loss) from a given stop-loss price
 *
 * Conventions:
 * - Returns POSITIVE magnitudes (lossUsd/lossPercent).
 * - If the provided SL is actually "profitable" for the position,
 *   this will return 0 (since it's not a loss). If you want signed values, tell me.
 */
export function calculateLossFromSl(input: LossFromSlInput): LossFromSlResult {
  const { entryPrice, positionSize, slPrice, side, leverage, decimals } = input

  const d = BigInt(decimals)
  const SCALE = 10n ** d

  const entryPx = parseUnits(entryPrice, decimals)
  const slPx = parseUnits(slPrice, decimals)
  const sizeScaled = parseUnits(positionSize, decimals)

  if (entryPx <= 0n) throw new Error('entryPrice must be > 0')
  if (slPx <= 0n) throw new Error('slPrice must be > 0')
  if (sizeScaled <= 0n) throw new Error('positionSize must be > 0')
  if (leverage <= 0n) throw new Error('leverage must be > 0')

  // priceDiff is positive when SL represents a LOSS
  // short loss: sl > entry => sl - entry
  // long  loss: sl < entry => entry - sl
  const priceDiff = side === 'A' ? slPx - entryPx : entryPx - slPx

  // If priceDiff <= 0, the "SL" is not a losing price (it's breakeven/profit),
  // return 0 magnitudes for loss.
  if (priceDiff <= 0n) {
    return { lossUsd: '0', lossPercent: '0' }
  }

  const lossUsd = (priceDiff * sizeScaled) / SCALE

  const entryNotionalUsd = (entryPx * sizeScaled) / SCALE
  if (entryNotionalUsd <= 0n) throw new Error('entryNotionalUsd must be > 0')

  const roePercentScaled =
    (lossUsd * leverage * 100n * SCALE) / entryNotionalUsd

  return {
    lossUsd: formatUnits(lossUsd, decimals),
    lossPercent: formatUnits(roePercentScaled, decimals),
  }
}

export const getExistingPositionTpSlOrders = (
  openOrders: UserOpenOrdersItemType[],
) => {
  if (!openOrders || openOrders.length === 0) {
    return { existingTpOrder: undefined, existingSlOrder: undefined }
  }
  const tpOrder = openOrders.find(
    (o) =>
      (o.orderType === 'Take Profit Limit' ||
        o.orderType === 'Take Profit Market') &&
      o.isPositionTpsl,
  )
  const slOrder = openOrders.find(
    (o) =>
      (o.orderType === 'Stop Limit' || o.orderType === 'Stop Market') &&
      o.isPositionTpsl,
  )
  return { existingTpOrder: tpOrder, existingSlOrder: slOrder }
}
