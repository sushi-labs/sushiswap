import { TickMath } from 'sushi/evm'

export const TICK_SPACING = 200
export const MIN_USABLE_TICK = -887_200
export const MAX_USABLE_TICK = 887_200
export const MAX_BOUNDARY_OFFSET = 46_000
export const ALLOCATION_DENOMINATOR_BPS = 10_000
export const USD_PRICE_DECIMALS = 18
export const TOKEN_TOTAL_SUPPLY_RAW = 1_000_000_000n * 10n ** 18n

const Q192 = 1n << 192n

export type CurvePresetId =
  | 'classic'
  | 'steady-price-discovery'
  | 'fast-price-discovery'

interface PresetRangeDefinition {
  startOffset: number
  endOffset: number | null
  allocationBps: number
}

export interface CurvePreset {
  id: CurvePresetId
  name: string
  description: string
  ranges: PresetRangeDefinition[]
}

export interface GeneratedSaleRange {
  startTick: number
  endTick: number
  amount: bigint
}

export const CURVE_PRESETS: CurvePreset[] = [
  {
    id: 'classic',
    name: 'Classic',
    description:
      'The price starts moving gradually, then climbs faster as more tokens are bought.',
    ranges: [{ startOffset: 0, endOffset: null, allocationBps: 10_000 }],
  },
  {
    id: 'steady-price-discovery',
    name: 'Steady Price Discovery',
    description:
      'The price rises more slowly at first, giving early buyers more tokens before the curve gets steeper.',
    ranges: [
      { startOffset: 0, endOffset: 13_800, allocationBps: 6_000 },
      { startOffset: 13_800, endOffset: 27_600, allocationBps: 2_500 },
      { startOffset: 27_600, endOffset: 46_000, allocationBps: 1_000 },
      { startOffset: 46_000, endOffset: null, allocationBps: 500 },
    ],
  },
  {
    id: 'fast-price-discovery',
    name: 'Fast Price Discovery',
    description:
      'The price rises quickly from the first buys, smaller purchases can cause sharper price moves.',
    ranges: [
      { startOffset: 0, endOffset: 13_800, allocationBps: 2_500 },
      { startOffset: 13_800, endOffset: 27_600, allocationBps: 2_500 },
      { startOffset: 27_600, endOffset: 46_000, allocationBps: 2_500 },
      { startOffset: 46_000, endOffset: null, allocationBps: 2_500 },
    ],
  },
]

function ceilDivide(numerator: bigint, denominator: bigint): bigint {
  if (denominator <= 0n) throw new RangeError('Denominator must be positive')
  return (numerator + denominator - 1n) / denominator
}

/**
 * Converts a USD FDV and a trusted USD-per-quote-token price to raw quote
 * units. Rounding up ensures the requested USD valuation is never weakened by
 * quote-token decimal conversion.
 */
export function usdFdvToQuoteRaw({
  initialFdvUsdRaw,
  quotePriceUsdRaw,
  quoteDecimals,
}: {
  initialFdvUsdRaw: bigint
  quotePriceUsdRaw: bigint
  quoteDecimals: number
}): bigint {
  if (initialFdvUsdRaw <= 0n) {
    throw new RangeError('Initial USD FDV must be positive')
  }
  if (quotePriceUsdRaw <= 0n) {
    throw new RangeError('Quote-token USD price must be positive')
  }
  if (!Number.isInteger(quoteDecimals) || quoteDecimals < 0) {
    throw new RangeError('Quote-token decimals must be a non-negative integer')
  }

  return ceilDivide(
    initialFdvUsdRaw * 10n ** BigInt(quoteDecimals),
    quotePriceUsdRaw,
  )
}

function tickPriceNumerator(tick: number, totalSupplyRaw: bigint): bigint {
  const sqrtPriceX96 = TickMath.getSqrtRatioAtTick(tick)
  return sqrtPriceX96 * sqrtPriceX96 * totalSupplyRaw
}

/**
 * Finds the lowest spacing-aligned launch-relative tick whose realized raw
 * quote/launch-token price satisfies the creator's requested starting FDV.
 */
export function alignInitialTick({
  initialFdvQuoteRaw,
  totalSupplyRaw = TOKEN_TOTAL_SUPPLY_RAW,
}: {
  initialFdvQuoteRaw: bigint
  totalSupplyRaw?: bigint
}): number {
  if (initialFdvQuoteRaw <= 0n) {
    throw new RangeError('Initial quote-token FDV must be positive')
  }
  if (totalSupplyRaw <= 0n) {
    throw new RangeError('Total supply must be positive')
  }

  const maximumInitialTick = MAX_USABLE_TICK - MAX_BOUNDARY_OFFSET
  const target = initialFdvQuoteRaw * Q192
  const minimumPrice = tickPriceNumerator(MIN_USABLE_TICK, totalSupplyRaw)
  const maximumPrice = tickPriceNumerator(maximumInitialTick, totalSupplyRaw)

  if (target < minimumPrice || target > maximumPrice) {
    throw new RangeError('Starting FDV is outside the supported tick range')
  }

  let low = MIN_USABLE_TICK / TICK_SPACING
  let high = maximumInitialTick / TICK_SPACING

  // Binary search avoids logs and floating-point drift in transaction inputs.
  while (low < high) {
    const middle = Math.floor((low + high) / 2)
    const tick = middle * TICK_SPACING
    if (tickPriceNumerator(tick, totalSupplyRaw) >= target) {
      high = middle
    } else {
      low = middle + 1
    }
  }

  return low * TICK_SPACING
}

export function realizedInitialFdvQuoteRaw(
  initialTick: number,
  totalSupplyRaw = TOKEN_TOTAL_SUPPLY_RAW,
): bigint {
  if (
    initialTick < MIN_USABLE_TICK ||
    initialTick > MAX_USABLE_TICK ||
    initialTick % TICK_SPACING !== 0
  ) {
    throw new RangeError('Initial tick is not usable')
  }

  return tickPriceNumerator(initialTick, totalSupplyRaw) / Q192
}

export function quoteRawToUsdRaw({
  quoteAmountRaw,
  quotePriceUsdRaw,
  quoteDecimals,
}: {
  quoteAmountRaw: bigint
  quotePriceUsdRaw: bigint
  quoteDecimals: number
}): bigint {
  return (quoteAmountRaw * quotePriceUsdRaw) / 10n ** BigInt(quoteDecimals)
}

export function liquidityAllocationForReserve(reserveBps: number): bigint {
  if (
    !Number.isInteger(reserveBps) ||
    reserveBps < 0 ||
    reserveBps > ALLOCATION_DENOMINATOR_BPS
  ) {
    throw new RangeError('Reserve basis points are invalid')
  }

  const reserve =
    (TOKEN_TOTAL_SUPPLY_RAW * BigInt(reserveBps)) /
    BigInt(ALLOCATION_DENOMINATOR_BPS)
  return TOKEN_TOTAL_SUPPLY_RAW - reserve
}

export function generatePresetRanges({
  preset,
  initialTick,
  liquidityAllocation,
}: {
  preset: CurvePreset
  initialTick: number
  liquidityAllocation: bigint
}): GeneratedSaleRange[] {
  if (liquidityAllocation <= 0n) {
    throw new RangeError('Liquidity allocation must be positive')
  }

  let allocated = 0n

  return preset.ranges.map((range, index) => {
    const isLast = index === preset.ranges.length - 1
    const startTick = initialTick + range.startOffset
    const endTick =
      range.endOffset === null ? MAX_USABLE_TICK : initialTick + range.endOffset
    const amount = isLast
      ? liquidityAllocation - allocated
      : (liquidityAllocation * BigInt(range.allocationBps)) /
        BigInt(ALLOCATION_DENOMINATOR_BPS)

    if (
      startTick < MIN_USABLE_TICK ||
      endTick > MAX_USABLE_TICK ||
      startTick >= endTick ||
      startTick % TICK_SPACING !== 0 ||
      endTick % TICK_SPACING !== 0 ||
      amount <= 0n
    ) {
      throw new RangeError('Generated range is invalid')
    }

    allocated += amount
    return { startTick, endTick, amount }
  })
}
