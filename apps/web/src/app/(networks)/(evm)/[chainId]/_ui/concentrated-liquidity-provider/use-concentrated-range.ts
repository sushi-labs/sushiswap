'use client'

import { useMemo } from 'react'
import { Bound } from 'src/lib/constants'
import {
  getSingleSidedRangeTick,
  getTickLimits,
  getTickToPrice,
  resolveRangeTick,
} from 'src/lib/pool/cl'
import { Price } from 'sushi'
import {
  type EvmCurrency,
  TickMath,
  getPriceRangeWithTokenRatio,
  sushiSwapV4PriceToClosestTick,
} from 'sushi/evm'
import type { RangeState } from './state'

// The prices `getPriceRangeWithTokenRatio` clamps an unbounded side to
const WEIGHTED_PRICE_LIMIT = 2 ** 112

/** The key a range is stored under: ticks only mean anything in their pool. */
export function getRangePairKey(
  currency0: EvmCurrency | undefined,
  currency1: EvmCurrency | undefined,
): string | undefined {
  return currency0 && currency1 ? `${currency0.id}:${currency1.id}` : undefined
}

/** The stored range if it's for this pair; one for another pair is none. */
export function getOwnRange(
  range: RangeState | undefined,
  currency0: EvmCurrency | undefined,
  currency1: EvmCurrency | undefined,
): RangeState | undefined {
  const pair = getRangePairKey(currency0, currency1)
  return range && pair && range.pair === pair ? range : undefined
}

interface UseConcentratedRangeParams<TCurrency extends EvmCurrency> {
  /** The pool's currencies, sorted. */
  currency0: TCurrency | undefined
  currency1: TCurrency | undefined
  /** The pool's (or the typed start) price of currency0 in currency1. */
  price: Price<TCurrency, TCurrency> | undefined
  /** Whether prices show as of currency1, so its min sets the upper tick. */
  invertPrice: boolean
  tickSpacing: number | undefined
  /** An existing position's ticks, which override the form's range. */
  existingTicks?: { tickLower: number; tickUpper: number } | undefined
  /** The form's range, as `useConcentratedMintState` gives it. */
  range: RangeState | undefined
}

export interface ConcentratedRange<TCurrency extends EvmCurrency> {
  /** Lower is always the smaller tick. */
  ticks: {
    [Bound.LOWER]: number | undefined
    [Bound.UPPER]: number | undefined
  }
  tickSpaceLimits: ReturnType<typeof getTickLimits>
  ticksAtLimit: { [Bound.LOWER]: boolean; [Bound.UPPER]: boolean }
  /** Prices of currency0 in currency1 at the ticks. */
  pricesAtTicks: {
    [Bound.LOWER]: Price<TCurrency, TCurrency> | undefined
    [Bound.UPPER]: Price<TCurrency, TCurrency> | undefined
  }
  invalidRange: boolean
  outOfRange: boolean
}

/**
 * The ticks of the concentrated liquidity form's range, shared by the V3 and
 * V4 mint flows: its stored ticks, snapped to the tick spacing, and adjusted
 * to a locked token weight if there's one.
 */
export function useConcentratedRange<TCurrency extends EvmCurrency>({
  currency0,
  currency1,
  price,
  invertPrice,
  tickSpacing,
  existingTicks,
  range,
}: UseConcentratedRangeParams<TCurrency>): ConcentratedRange<TCurrency> {
  const tickSpaceLimits = useMemo(
    () => getTickLimits(tickSpacing),
    [tickSpacing],
  )

  const ownRange = getOwnRange(range, currency0, currency1)
  const storedLower = ownRange?.[Bound.LOWER]
  const storedUpper = ownRange?.[Bound.UPPER]
  const independentBound = ownRange?.independentBound
  const weightLockedCurrency0 = ownRange?.weightLockedCurrency0

  const existingTickLower = existingTicks?.tickLower
  const existingTickUpper = existingTicks?.tickUpper
  const ticks = useMemo(() => {
    if (existingTickLower !== undefined && existingTickUpper !== undefined) {
      return {
        [Bound.LOWER]: existingTickLower,
        [Bound.UPPER]: existingTickUpper,
      }
    }

    const lower = resolveRangeTick(storedLower, Bound.LOWER, tickSpacing)
    const upper = resolveRangeTick(storedUpper, Bound.UPPER, tickSpacing)
    if (
      typeof weightLockedCurrency0 !== 'number' ||
      !price ||
      !currency0 ||
      !currency1 ||
      lower === undefined ||
      upper === undefined ||
      !tickSpacing
    ) {
      return { [Bound.LOWER]: lower, [Bound.UPPER]: upper }
    }

    // The weighting works in displayed prices, of currency1 when inverted, so
    // its min is the upper tick
    const [base, quote] = invertPrice
      ? [currency1, currency0]
      : [currency0, currency1]
    const [minTick, maxTick] = invertPrice ? [upper, lower] : [lower, upper]
    const minPrice = getTickToPrice(base, quote, minTick)?.toNumber()
    const maxPrice = getTickToPrice(base, quote, maxTick)?.toNumber()
    if (minPrice === undefined || maxPrice === undefined) {
      return { [Bound.LOWER]: lower, [Bound.UPPER]: upper }
    }

    // Pool bounds of the displayed min and max
    const [minBound, maxBound] = invertPrice
      ? [Bound.UPPER, Bound.LOWER]
      : [Bound.LOWER, Bound.UPPER]
    const currentPrice = (invertPrice ? price.invert() : price).toNumber()
    let weighted: [number, number] | undefined
    try {
      weighted = getPriceRangeWithTokenRatio(
        currentPrice,
        minPrice,
        maxPrice,
        (independentBound ?? Bound.LOWER) === minBound
          ? Bound.LOWER
          : Bound.UPPER,
        invertPrice ? 1 - weightLockedCurrency0 : weightLockedCurrency0,
      )
    } catch {
      // No range has the weight with that bound, e.g. one at the price
      return { [Bound.LOWER]: lower, [Bound.UPPER]: upper }
    }

    // A bound the weight leaves (maybe moved to the other side) keeps its
    // exact tick; one it computes is the tick of its price, snapped outward
    const decimalsScale = 10 ** (currency1.decimals - currency0.decimals)
    const spacing = tickSpacing
    const poolPrice = price
    function toTick(
      value: number | undefined,
      bound: Bound,
    ): number | undefined {
      if (value === minPrice) return minTick
      if (value === maxPrice) return maxTick
      // A 0% or 100% weight puts a bound at the price: it borders it, so the
      // range stays out of it and takes one currency
      if (value === currentPrice)
        return getSingleSidedRangeTick(
          sushiSwapV4PriceToClosestTick(poolPrice),
          spacing,
          bound === Bound.LOWER ? 'above' : 'below',
        )
      if (value === undefined || !(value > 0)) return undefined
      // The weighting clamps an unbounded side to these, the limit
      if (value >= WEIGHTED_PRICE_LIMIT || value <= 1 / WEIGHTED_PRICE_LIMIT)
        return resolveRangeTick(true, bound, spacing)
      const priceOf0 = invertPrice ? 1 / value : value
      const tick = Math.log(priceOf0 * decimalsScale) / Math.log(1.0001)
      // Ignore floating-point noise before snapping outward by a whole spacing.
      const rounded = Math.round(tick)
      return resolveRangeTick(
        Math.abs(tick - rounded) < 1e-7 ? rounded : tick,
        bound,
        spacing,
      )
    }
    const newMin = toTick(weighted?.[0], minBound)
    const newMax = toTick(weighted?.[1], maxBound)
    return invertPrice
      ? { [Bound.LOWER]: newMax, [Bound.UPPER]: newMin }
      : { [Bound.LOWER]: newMin, [Bound.UPPER]: newMax }
  }, [
    existingTickLower,
    existingTickUpper,
    storedLower,
    storedUpper,
    tickSpacing,
    weightLockedCurrency0,
    price,
    invertPrice,
    currency0,
    currency1,
    independentBound,
  ])

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks

  const ticksAtLimit = useMemo(
    () => ({
      [Bound.LOWER]:
        tickLower !== undefined && tickLower === tickSpaceLimits[Bound.LOWER],
      [Bound.UPPER]:
        tickUpper !== undefined && tickUpper === tickSpaceLimits[Bound.UPPER],
    }),
    [tickLower, tickUpper, tickSpaceLimits],
  )

  const invalidRange = Boolean(
    typeof tickLower === 'number' &&
      typeof tickUpper === 'number' &&
      tickLower >= tickUpper,
  )

  const pricesAtTicks = useMemo(
    () => ({
      [Bound.LOWER]: getTickToPrice(currency0, currency1, tickLower),
      [Bound.UPPER]: getTickToPrice(currency0, currency1, tickUpper),
    }),
    [currency0, currency1, tickLower, tickUpper],
  )
  const { [Bound.LOWER]: lowerPrice, [Bound.UPPER]: upperPrice } = pricesAtTicks

  const outOfRange = Boolean(
    !invalidRange &&
      price &&
      lowerPrice &&
      upperPrice &&
      (price.lt(lowerPrice) || price.gt(upperPrice)),
  )

  return {
    ticks,
    tickSpaceLimits,
    ticksAtLimit,
    pricesAtTicks,
    invalidRange,
    outOfRange,
  }
}

/**
 * The price of currency0 a typed start price sets. It's of the currency with
 * ID `base`, or if that's of another pair, of the displayed base.
 */
export function parseStartPrice<TCurrency extends EvmCurrency>({
  currency0,
  currency1,
  typedValue,
  base,
  invertPrice,
}: {
  currency0: TCurrency | undefined
  currency1: TCurrency | undefined
  typedValue: string
  base: string | undefined
  invertPrice: boolean
}): Price<TCurrency, TCurrency> | undefined {
  if (!currency0 || !currency1) return undefined
  const ofCurrency1 =
    base === currency1.id || (base !== currency0.id && invertPrice)
  const typed = Price.tryFromHuman(
    ofCurrency1 ? currency1 : currency0,
    ofCurrency1 ? currency0 : currency1,
    typedValue,
  )
  // Exact: a price of 0 is none, and one of currency1 counts inverted
  if (!typed || typed.numerator === 0n) return undefined
  return ofCurrency1 ? typed.invert() : typed
}

/**
 * Which currencies a range takes at the pool price: none of currency0 at or
 * above the upper tick, none of currency1 at or below the lower one.
 */
export function getDepositsDisabled({
  sqrtRatioX96,
  tickLower,
  tickUpper,
}: {
  sqrtRatioX96: bigint | undefined
  tickLower: number | undefined
  tickUpper: number | undefined
}): { deposit0Disabled: boolean; deposit1Disabled: boolean } {
  return {
    deposit0Disabled:
      sqrtRatioX96 !== undefined &&
      typeof tickUpper === 'number' &&
      sqrtRatioX96 >= TickMath.getSqrtRatioAtTick(tickUpper),
    deposit1Disabled:
      sqrtRatioX96 !== undefined &&
      typeof tickLower === 'number' &&
      sqrtRatioX96 <= TickMath.getSqrtRatioAtTick(tickLower),
  }
}
