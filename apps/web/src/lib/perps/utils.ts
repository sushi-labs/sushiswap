import { formatPrice, formatSize } from '@nktkas/hyperliquid/utils'
import { formatUnits, parseUnits } from 'viem'
import type { PerpOrSpotAsset } from './subscription/use-asset-list'
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

export function getHyperliquidCoinIconUrl(
  asset: PerpOrSpotAsset | undefined,
): string {
  if (!asset) return ''

  const { dex = '', marketType, symbol = '', name = '' } = asset

  const prefix = dex !== '' ? `${dex}:` : ''

  const baseSymbol =
    marketType === 'spot'
      ? symbol.split('/')?.[0]
      : dex
        ? symbol.split('-')?.[0]
        : name

  const suffix = marketType === 'spot' ? '_spot' : ''

  return `https://app.hyperliquid.xyz/coins/${prefix}${baseSymbol}${suffix}.svg`
}

export const getAssetIdForConverter = (asset: PerpOrSpotAsset) => {
  let id
  if (asset.marketType === 'perp') {
    id = asset.name // BTC perp  "xyz:GOLD" builder dex
  } else {
    id = asset?.untouchedSymbol //USOL/USDC - spot
  }
  return id
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

function stripSign(s: string) {
  return s.trim().startsWith('-') ? s.trim().slice(1) : s.trim()
}

export const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)

  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60

  return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':')
}

export const getTwapOrderCount = (totalRunningTimeInMinutes: number) => {
  const timeInSeconds = totalRunningTimeInMinutes * 60
  return Math.floor(timeInSeconds / 30) + 1
}

export const getTwapSuborderSize = ({
  totalSize,
  orderCount,
  decimals,
}: {
  totalSize: string
  orderCount: number
  decimals: number
}) => {
  if (Number(totalSize) === 0) return '0'
  let parsedSize = 0n
  try {
    parsedSize = parseUnits(totalSize, decimals)
  } catch (error) {
    console.log(error)
    parsedSize = 0n
  }
  const orderCountBN = BigInt(orderCount) || 1n
  const sizePerOrderBN = parsedSize / orderCountBN
  return formatUnits(sizePerOrderBN, decimals)
}

//Todo: move these math helpers to a separate file
export function calculateIsolatedMargin({
  baseSize,
  price,
  leverage,
  decimals,
}: {
  baseSize: string
  price: string
  leverage: number | string
  decimals: number
}): { isolatedMargin: bigint; isolatedMarginFormatted: string } | null {
  try {
    const SCALE = 10n ** BigInt(decimals)

    const sizeScaled = parseUnits(baseSize, decimals)
    const priceScaled = parseUnits(price, decimals)
    const lev = BigInt(leverage)

    if (sizeScaled <= 0n || priceScaled <= 0n || lev <= 0n) return null

    const notional = (sizeScaled * priceScaled) / SCALE
    const isolatedMargin = notional / lev

    return {
      isolatedMargin,
      isolatedMarginFormatted: formatUnits(isolatedMargin, decimals),
    }
  } catch {
    return null
  }
}

// Formula:
// liq_price = price - side * margin_available / position_size / (1 - l * side)
// where
// l = 1 / MAINTENANCE_LEVERAGE . For assets with margin tiers, maintenance leverage depends on the unique margin tier corresponding to the position value at the liquidation price.
// side = 1 for long and -1 for short
// margin_available (cross) = account_value - maintenance_margin_required
// margin_available (isolated) = isolated_margin - maintenance_margin_required

//todo: refactor to use bigints
export function estimateLiquidationPrice({
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
  maintenanceMarginRequired?: string
  positionSize: string
  isCross: boolean
}): string | null {
  try {
    const s = side === 'A' ? -1 : 1

    const mmr = Number(maintenanceMarginRequired ?? '0')
    const equity = Number(isCross ? accountValue : isolatedMargin)

    const marginAvailable = equity - mmr
    const Q = Number(positionSize)
    const P = Number(price)
    const maintLev = Number(maintenanceLeverage)

    if (
      !Number.isFinite(marginAvailable) ||
      !Number.isFinite(Q) ||
      !Number.isFinite(P) ||
      !Number.isFinite(maintLev)
    )
      return null
    if (Q === 0 || maintLev <= 0) return null

    const l = 1 / maintLev
    const denom = 1 - l * s
    if (denom === 0) return null

    const delta = (s * marginAvailable) / Q / denom
    const liq = P - delta

    if (liq < 0 || Number.isNaN(liq) || !Number.isFinite(liq)) return null
    return liq.toString()
  } catch {
    return null
  }
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

export const getSizeAndPercentageFromInput = ({
  inputValue,
  maxSize,
  sizeSide,
  decimals,
  priceUsd,
}: {
  inputValue: string
  maxSize: string
  sizeSide: 'base' | 'quote'
  decimals: number
  priceUsd: string
}) => {
  if (decimals === undefined)
    return { baseSize: '', quoteSize: '', percentage: 0 }
  const scalingDecimals = decimals * 2
  const SCALE = 10n ** BigInt(scalingDecimals)

  const maxSizeAbs = stripSign(maxSize ?? '0')
  const currentBase = parseUnits(maxSizeAbs, scalingDecimals)

  const price = parseUnits(priceUsd ?? '0', scalingDecimals)

  const inputScaled = parseUnits(inputValue || '0', scalingDecimals)

  let closeBase = 0n
  let closeQuote = 0n

  if (sizeSide === 'base') {
    closeBase = inputScaled
    closeQuote =
      closeBase === 0n || price === 0n ? 0n : (closeBase * price) / SCALE
  } else {
    closeQuote = inputScaled
    closeBase =
      closeQuote === 0n || price === 0n ? 0n : (closeQuote * SCALE) / price
  }

  const percentBps =
    currentBase === 0n ? 0n : (closeBase * 10_000n) / currentBase // 0..10000
  const clampedBps =
    percentBps < 0n ? 0n : percentBps > 10_000n ? 10_000n : percentBps

  const percentage = Math.ceil(Number(clampedBps) / 100)

  const baseStr = formatSize(formatUnits(closeBase, scalingDecimals), decimals)
  const quoteStr = formatSize(
    formatUnits(closeQuote, scalingDecimals),
    decimals,
  )

  return { baseSize: baseStr, quoteSize: quoteStr, percentage }
}

export const getSizeAndPercentageFromPercentageInput = ({
  percentageInput,
  maxSize,
  decimals,
  priceUsd,
}: {
  percentageInput: number
  maxSize: string
  decimals: number
  priceUsd: string
}) => {
  if (decimals === undefined) {
    return { baseSize: '', quoteSize: '', percentage: 0 }
  }
  const scalingDecimals = decimals * 2
  const SCALE = 10n ** BigInt(scalingDecimals)

  const currentBase = parseUnits(stripSign(maxSize ?? '0'), scalingDecimals)

  const price = parseUnits(priceUsd ?? '0', scalingDecimals)
  const currentQuote = currentBase === 0n ? 0n : (currentBase * price) / SCALE

  let percent = BigInt(percentageInput)

  if (percent < 0n) percent = 0n
  if (percent > 100n) percent = 100n
  const percentage = Number(percent)

  const closeBase = (currentBase * percent) / 100n
  const closeQuote = (currentQuote * percent) / 100n
  const baseStr = formatSize(formatUnits(closeBase, scalingDecimals), decimals)
  const quoteStr = formatSize(
    formatUnits(closeQuote, scalingDecimals),
    decimals,
  )

  return {
    baseSize: baseStr,
    quoteSize: quoteStr,
    percentage,
  }
}

export function calculateMarginRequired({
  baseSize,
  price,
  leverage,
  decimals,
}: {
  baseSize: string
  price: string
  leverage: number | string
  decimals: number
}) {
  if (!baseSize || !price || !leverage) return null

  try {
    const SCALE = 10n ** BigInt(decimals)

    const sizeScaled = parseUnits(baseSize, decimals)
    const priceScaled = parseUnits(price, decimals)
    const lev = BigInt(leverage)

    if (sizeScaled <= 0n || priceScaled <= 0n || lev <= 0n) {
      return null
    }

    // notional = base * price / SCALE
    const notional = (sizeScaled * priceScaled) / SCALE

    // margin = notional / leverage
    const marginRequired = notional / lev

    return {
      marginRequired,
      marginRequiredFormatted: formatUnits(marginRequired, decimals),
    }
  } catch {
    return null
  }
}

export function calculateOrderValue({
  baseSize,
  price,
  decimals,
}: {
  baseSize: string
  price: string
  decimals: number
}) {
  if (!baseSize || !price) return null

  try {
    const SCALE = 10n ** BigInt(decimals)

    const sizeScaled = parseUnits(baseSize, decimals)
    const priceScaled = parseUnits(price, decimals)

    if (sizeScaled <= 0n || priceScaled <= 0n) return null

    // notional = base * price / SCALE
    const notional = (sizeScaled * priceScaled) / SCALE

    return {
      notional,
      notionalFormatted: formatUnits(notional, decimals),
    }
  } catch {
    return null
  }
}

//todo: switch to using bigint math
export function buildScaleOrders({
  totalSize,
  startPrice,
  endPrice,
  numberOfOrders,
  sizeSkew,
  decimals,
  marketType,
}: {
  totalSize: string
  startPrice: string
  endPrice: string
  numberOfOrders: string
  sizeSkew: string // 0.01..100 (interpreted as last/first multiplier)
  decimals: number
  marketType: 'spot' | 'perp'
}) {
  const _endPrice = Number.parseFloat(endPrice)
  const _startPrice = Number.parseFloat(startPrice)
  const _totalSize = Number.parseFloat(totalSize)
  const _sizeSkew = Number.parseFloat(sizeSkew)
  const n = Math.max(1, Number(numberOfOrders) || 2)

  const denom = Math.max(1, n - 1)

  // prices: linear ladder (inclusive)
  const prices = Array.from({ length: n }, (_, i) => {
    const t = i / denom
    return _startPrice + t * (_endPrice - _startPrice)
  })
  prices[n - 1] = _endPrice

  // weights: LINEAR from 1 -> sizeSkew
  const weights = Array.from({ length: n }, (_, i) => {
    const t = i / denom
    return 1 + t * (_sizeSkew - 1)
  })

  const wSum = weights.reduce((a, b) => a + b, 0)

  // sizes normalized to sum exactly to totalSize (fix rounding drift on last)
  const sizes = weights.map((w) => (_totalSize * w) / wSum)

  const orders = Array.from({ length: n }, (_, idx) => {
    let _price
    let _size
    try {
      _price = formatPrice(prices[idx], decimals, marketType)
    } catch {
      _price = '0'
    }
    try {
      _size = formatSize(sizes[idx], decimals)
    } catch {
      _size = '0'
    }
    const usdValue = Number(prices[idx]) * Number(sizes[idx])
    return {
      price: _price,
      size: _size,
      estUsdValue: usdValue,
    }
  })
  let computedTotalSize = orders
    .reduce((acc, order) => acc + Number(order.size), 0)
    ?.toString()
  try {
    computedTotalSize = formatSize(computedTotalSize, decimals)
  } catch {
    computedTotalSize = '0'
  }

  const allOrdersValid = orders.every((order) => order.estUsdValue >= 10)

  return { orders, totalSize: computedTotalSize, allOrdersValid }
}
