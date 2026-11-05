import { Bound } from 'src/lib/constants'
import { type Fraction, Price } from 'sushi'
import {
  type EvmCurrency,
  TickMath,
  encodeSqrtRatioX96,
  nearestUsableTick,
  sortSushiSwapV4Currencies,
  sushiSwapV4PriceToClosestTick,
  sushiSwapV4TickToPrice,
} from 'sushi/evm'

// V4's tick math orders native as V4 pools do and equals V3's for tokens, so it serves both

/**
 * A range bound as the mint form holds it: a pool tick, not yet snapped to a
 * tick spacing, or `true` for the limit on its side.
 */
export type RangeTick = number | true

/** The lowest and highest ticks a position in a pool with `tickSpacing` can use. */
export function getTickLimits(tickSpacing: number | undefined): {
  [Bound.LOWER]: number | undefined
  [Bound.UPPER]: number | undefined
} {
  return {
    [Bound.LOWER]: tickSpacing
      ? nearestUsableTick(TickMath.MIN_TICK, tickSpacing)
      : undefined,
    [Bound.UPPER]: tickSpacing
      ? nearestUsableTick(TickMath.MAX_TICK, tickSpacing)
      : undefined,
  }
}

/**
 * The tick at or below a typed price of `base` in `quote`, clamped to the
 * tick limits, which a price of 0 or one out of bounds takes.
 */
export function parsePriceTick(
  base: EvmCurrency | undefined,
  quote: EvmCurrency | undefined,
  value: string,
): number | undefined {
  if (!base || !quote) return undefined
  const price = Price.tryFromHuman(base, quote, value)
  if (!price) return undefined

  // Ticks price currency0, so a price of currency1 counts inverted
  const [currency0] = sortSushiSwapV4Currencies(price.base, price.quote)
  const sorted = currency0.isSame(price.base)
  // A price of 0 is the lowest one of `base`: the highest tick if it's currency1
  if (price.numerator === 0n)
    return sorted ? TickMath.MIN_TICK : TickMath.MAX_TICK

  const sqrtRatioX96 = sorted
    ? encodeSqrtRatioX96(price.numerator, price.denominator)
    : encodeSqrtRatioX96(price.denominator, price.numerator)
  if (sqrtRatioX96 >= TickMath.MAX_SQRT_RATIO) return TickMath.MAX_TICK
  if (sqrtRatioX96 <= TickMath.MIN_SQRT_RATIO) return TickMath.MIN_TICK
  return sushiSwapV4PriceToClosestTick(price)
}

/**
 * The usable tick a range bound sets, on its side for `true`. A tick snaps
 * outward, so a range never narrows, or collapses, to the tick spacing.
 */
export function resolveRangeTick(
  bound: RangeTick | undefined,
  side: Bound,
  tickSpacing: number | undefined,
): number | undefined {
  if (bound === undefined || !tickSpacing) return undefined
  if (bound === true) return getTickLimits(tickSpacing)[side]
  const snap = side === Bound.LOWER ? Math.floor : Math.ceil
  return toUsableTick(snap(bound / tickSpacing) * tickSpacing, tickSpacing)
}

/**
 * The tick of a bound stepped by one tick spacing, from `fallbackTick` (the
 * pool's) if the bound is unset. `direction` is in prices of the displayed
 * base currency, so it's reversed when that's currency1 (`invertPrice`).
 */
export function stepRangeTick(
  tick: number | undefined,
  fallbackTick: number | undefined,
  tickSpacing: number | undefined,
  direction: 1 | -1,
  invertPrice: boolean,
): number | undefined {
  const from = tick ?? fallbackTick
  if (!tickSpacing || from === undefined) return undefined
  return toUsableTick(
    from + (invertPrice ? -direction : direction) * tickSpacing,
    tickSpacing,
  )
}

/**
 * The ticks of a ×÷ preset around `tickCurrent`, at least one tick spacing
 * apart. Scaling a price by a multiplier moves it the same number of ticks in
 * either orientation, so the preset is the same whichever currency is base.
 */
export function getMultiplierRangeTicks(
  tickCurrent: number,
  multiplier: Fraction,
  tickSpacing: number,
): [lower: number, upper: number] {
  const offset = Math.log(multiplier.toNumber()) / Math.log(1.0001)
  const lower = toUsableTick(tickCurrent - offset, tickSpacing)
  const upper = toUsableTick(tickCurrent + offset, tickSpacing)
  if (lower < upper) return [lower, upper]
  // Narrower than a tick spacing: the spacing around the current tick
  return [
    getSingleSidedRangeTick(tickCurrent, tickSpacing, 'below'),
    getSingleSidedRangeTick(tickCurrent, tickSpacing, 'above'),
  ]
}

/**
 * The single sided range on one side of `tickCurrent`, as its tick next to
 * the price: `below` takes only currency1, `above` only currency0. The price
 * is in [tickCurrent, tickCurrent + 1), so the range above starts after it.
 */
export function getSingleSidedRangeTick(
  tickCurrent: number,
  tickSpacing: number,
  side: 'below' | 'above',
): number {
  const below = Math.floor(tickCurrent / tickSpacing) * tickSpacing
  return toUsableTick(
    side === 'below' ? below : below + tickSpacing,
    tickSpacing,
  )
}

/** `tick` rounded to the nearest usable tick within the limits. */
export function toUsableTick(tick: number, tickSpacing: number): number {
  const min = nearestUsableTick(TickMath.MIN_TICK, tickSpacing)
  const max = nearestUsableTick(TickMath.MAX_TICK, tickSpacing)
  const usable = nearestUsableTick(
    Math.min(Math.max(Math.round(tick), min), max),
    tickSpacing,
  )
  return usable || 0 // Not -0
}

export function getTickToPrice<
  TBase extends EvmCurrency,
  TQuote extends EvmCurrency,
>(
  base: TBase | undefined,
  quote: TQuote | undefined,
  tick: number | undefined,
): Price<TBase, TQuote> | undefined {
  if (!base || !quote || typeof tick !== 'number') return undefined
  return sushiSwapV4TickToPrice(base, quote, tick)
}
