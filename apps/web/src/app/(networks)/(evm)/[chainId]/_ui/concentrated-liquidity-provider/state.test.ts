import { Bound, Field } from 'src/lib/constants'
import { describe, expect, it } from 'vitest'
import {
  concentratedLiquidityReducer,
  initialConcentratedLiquidityState,
} from './state'

describe('concentratedLiquidityReducer', () => {
  it('updates the amount', () => {
    const withAmount = concentratedLiquidityReducer(
      initialConcentratedLiquidityState,
      {
        type: 'typeInput',
        field: Field.CURRENCY_B,
        typedValue: '1.25',
      },
    )
    expect(withAmount).toMatchObject({
      independentField: Field.CURRENCY_B,
      typedValue: '1.25',
    })
  })

  it('sets a range and resets to initial state', () => {
    const fullRange = concentratedLiquidityReducer(
      initialConcentratedLiquidityState,
      {
        type: 'setRange',
        pair: 'a:b',
        lower: true,
        upper: true,
        preset: undefined,
      },
    )

    expect(fullRange.range).toMatchObject({
      pair: 'a:b',
      [Bound.LOWER]: true,
      [Bound.UPPER]: true,
    })
    expect(
      concentratedLiquidityReducer(fullRange, { type: 'resetMintState' }),
    ).toBe(initialConcentratedLiquidityState)
  })

  it("sets one bound, dropping another pair's range", () => {
    const range = concentratedLiquidityReducer(
      initialConcentratedLiquidityState,
      {
        type: 'setRange',
        pair: 'a:b',
        lower: -60,
        upper: 60,
        preset: undefined,
      },
    )
    const sameBound = concentratedLiquidityReducer(range, {
      type: 'setRangeBound',
      pair: 'a:b',
      bound: Bound.UPPER,
      tick: 120,
    })
    expect(sameBound.range).toMatchObject({
      pair: 'a:b',
      [Bound.LOWER]: -60,
      [Bound.UPPER]: 120,
      independentBound: Bound.UPPER,
    })

    const otherPair = concentratedLiquidityReducer(range, {
      type: 'setRangeBound',
      pair: 'a:c',
      bound: Bound.UPPER,
      tick: 120,
    })
    expect(otherPair.range).toMatchObject({
      pair: 'a:c',
      [Bound.LOWER]: undefined,
      [Bound.UPPER]: 120,
    })
  })

  it("locks a weight on the pair's range only, until it's set again", () => {
    const range = concentratedLiquidityReducer(
      initialConcentratedLiquidityState,
      {
        type: 'setRange',
        pair: 'a:b',
        lower: -60,
        upper: 60,
        preset: undefined,
      },
    )
    const locked = concentratedLiquidityReducer(range, {
      type: 'setWeightLockedCurrency0',
      pair: 'a:b',
      value: 0.3,
    })
    expect(locked.range?.weightLockedCurrency0).toBe(0.3)
    expect(
      concentratedLiquidityReducer(range, {
        type: 'setWeightLockedCurrency0',
        pair: 'a:c',
        value: 0.3,
      }),
    ).toBe(range)
    const reset = concentratedLiquidityReducer(locked, {
      type: 'setRange',
      pair: 'a:b',
      lower: true,
      upper: true,
      preset: undefined,
    })
    expect(reset.range?.weightLockedCurrency0).toBeUndefined()
  })
})
