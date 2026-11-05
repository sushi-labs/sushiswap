'use client'

import { useCallback, useMemo } from 'react'
import { Bound } from 'src/lib/constants'
import {
  PRICE_RANGE_MULTIPLIERS,
  PriceRange,
  type RangeTick,
  formatStartPrice,
  getMultiplierRangeTicks,
  getSingleSidedRangeTick,
  parsePriceTick,
  stepRangeTick,
} from 'src/lib/pool/cl'
import type { Price } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import { useConcentratedMintActionHandlers, useConcentratedMintState } from '.'
import { getOwnRange, getRangePairKey } from './use-concentrated-range'

interface UseRangeInputParams {
  /** The pool's currencies, sorted. */
  currency0: EvmCurrency | undefined
  currency1: EvmCurrency | undefined
  /** Whether prices show as of currency1, so its min sets the upper tick. */
  invertPrice: boolean
  tickSpacing: number | undefined
  /** The pool's tick, or for a pool to create, the start price's. */
  tickCurrent: number | undefined
  /** The range's ticks, as `useConcentratedRange` gives them. */
  ticks: {
    [Bound.LOWER]?: number | undefined
    [Bound.UPPER]?: number | undefined
  }
}

export interface RangeInput {
  /** The ticks of the displayed min and max prices. */
  minTick: number | undefined
  maxTick: number | undefined
  /** Sets the min or max from a typed price; '' clears it, and invalid input does nothing. */
  setMinPrice(value: string): void
  setMaxPrice(value: string): void
  /**
   * Steps the min or max by one tick spacing, up or down in price. Returns
   * nothing, as `PriceBlock` steppers that set the range themselves do.
   */
  stepMin(direction: 1 | -1): undefined
  stepMax(direction: 1 | -1): undefined
  /** The preset that set the range, until anything else changed it. */
  preset: PriceRange | undefined
  /**
   * Sets the range a preset gives at the current price; the single sided
   * ones run from 0 to it (left), or from it to ∞ (right), taking one
   * currency. Does nothing without a current price.
   */
  applyPreset(preset: PriceRange): void
  /** Sets the range's ticks, or clears it; unlocks a locked weight. */
  setRange(lower: RangeTick | undefined, upper: RangeTick | undefined): void
  /** The locked weight of the displayed base in the position's value. */
  lockedWeight: number | undefined
  setLockedWeight(weight: number | undefined): void
}

/**
 * The concentrated liquidity form's range inputs, in displayed prices. The
 * range is stored as pool ticks, and the locked weight as currency0's, so
 * which currency prices show in never moves them; this maps the displayed min,
 * max and weight to them.
 */
export function useRangeInput({
  currency0,
  currency1,
  invertPrice,
  tickSpacing,
  tickCurrent,
  ticks,
}: UseRangeInputParams): RangeInput {
  const { range } = useConcentratedMintState()
  const {
    setRange: setStoredRange,
    setRangeBound,
    setWeightLockedCurrency0,
  } = useConcentratedMintActionHandlers()

  const pair = getRangePairKey(currency0, currency1)
  const ownRange = getOwnRange(range, currency0, currency1)
  const weightLockedCurrency0 = ownRange?.weightLockedCurrency0
  // A preset is of the pool it was applied to, so only for its tick spacing
  const preset =
    ownRange?.preset && ownRange.preset.tickSpacing === tickSpacing
      ? ownRange.preset.value
      : undefined
  // A higher price of currency1 is a lower tick
  const minBound = invertPrice ? Bound.UPPER : Bound.LOWER
  const maxBound = invertPrice ? Bound.LOWER : Bound.UPPER
  const minTick = ticks[minBound]
  const maxTick = ticks[maxBound]

  const setBound = useCallback(
    (bound: Bound, tick: RangeTick | undefined) => {
      if (pair) setRangeBound(pair, bound, tick)
    },
    [pair, setRangeBound],
  )

  const setPrice = useCallback(
    (bound: Bound, value: string) => {
      if (value === '') return setBound(bound, undefined)
      const [base, quote] = invertPrice
        ? [currency1, currency0]
        : [currency0, currency1]
      const tick = parsePriceTick(base, quote, value)
      if (tick !== undefined) setBound(bound, tick)
    },
    [setBound, invertPrice, currency0, currency1],
  )

  const setRange = useCallback(
    (
      lower: RangeTick | undefined,
      upper: RangeTick | undefined,
      preset?: PriceRange,
    ) => {
      if (!pair) return
      setStoredRange(
        pair,
        lower,
        upper,
        preset !== undefined && tickSpacing
          ? { value: preset, tickSpacing }
          : undefined,
      )
    },
    [pair, setStoredRange, tickSpacing],
  )

  const step = useCallback(
    (bound: Bound, tick: number | undefined, direction: 1 | -1): undefined => {
      const next = stepRangeTick(
        tick,
        tickCurrent,
        tickSpacing,
        direction,
        invertPrice,
      )
      // Nothing to step from leaves the bound as it is
      if (next !== undefined) setBound(bound, next)
      return undefined
    },
    [setBound, tickCurrent, tickSpacing, invertPrice],
  )

  const applyPreset = useCallback(
    (preset: PriceRange) => {
      if (preset === PriceRange.FULL_RANGE) return setRange(true, true, preset)
      if (tickCurrent === undefined || !tickSpacing) return

      const multiplier = PRICE_RANGE_MULTIPLIERS.find(
        ({ value }) => value === preset,
      )?.multiplier
      if (multiplier) {
        const [lower, upper] = getMultiplierRangeTicks(
          tickCurrent,
          multiplier,
          tickSpacing,
        )
        return setRange(lower, upper, preset)
      }

      // Prices of currency1 below the current one are ticks above it
      const below = preset === PriceRange.LEFT_SIDE
      const poolSide = invertPrice === below ? 'above' : 'below'
      const border = getSingleSidedRangeTick(tickCurrent, tickSpacing, poolSide)
      if (poolSide === 'below') setRange(true, border, preset)
      else setRange(border, true, preset)
    },
    [setRange, tickCurrent, tickSpacing, invertPrice],
  )

  return useMemo(
    () => ({
      minTick,
      maxTick,
      setMinPrice: (value) => setPrice(minBound, value),
      setMaxPrice: (value) => setPrice(maxBound, value),
      stepMin: (direction) => step(minBound, minTick, direction),
      stepMax: (direction) => step(maxBound, maxTick, direction),
      preset,
      applyPreset,
      setRange,
      lockedWeight:
        typeof weightLockedCurrency0 === 'number' && invertPrice
          ? 1 - weightLockedCurrency0
          : weightLockedCurrency0,
      setLockedWeight: (weight) => {
        if (!pair) return
        setWeightLockedCurrency0(
          pair,
          typeof weight === 'number' && invertPrice ? 1 - weight : weight,
        )
      },
    }),
    [
      minTick,
      maxTick,
      minBound,
      maxBound,
      setPrice,
      step,
      applyPreset,
      setRange,
      invertPrice,
      pair,
      preset,
      weightLockedCurrency0,
      setWeightLockedCurrency0,
    ],
  )
}

/**
 * The start price input, of the displayed base currency. A start price typed
 * as of the other currency shows inverted, so a switch never changes it.
 */
export function useStartPriceInput({
  currency0,
  currency1,
  price,
  invertPrice,
}: {
  /** The pool's currencies, sorted. */
  currency0: EvmCurrency | undefined
  currency1: EvmCurrency | undefined
  /** The start price of currency0, as the derived mint info parses it. */
  price: Price<EvmCurrency, EvmCurrency> | undefined
  invertPrice: boolean
}): { value: string; onChange(value: string): void } {
  const { startPriceTypedValue, startPriceBase } = useConcentratedMintState()
  const { onStartPriceInput } = useConcentratedMintActionHandlers()

  const base = invertPrice ? currency1 : currency0
  const quote = invertPrice ? currency0 : currency1
  // Typed as of the quote, it shows as the price of the base it sets, or as
  // nothing if it isn't a price
  const value =
    quote && startPriceBase === quote.id
      ? price
        ? formatStartPrice(invertPrice ? price.invert() : price)
        : ''
      : startPriceTypedValue
  const onChange = useCallback(
    (value: string) => onStartPriceInput(value, base?.id),
    [onStartPriceInput, base],
  )
  return { value, onChange }
}
