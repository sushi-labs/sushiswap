import { Bound, Field } from 'src/lib/constants'
import { describe, expect, it } from 'vitest'
import {
  concentratedLiquidityReducer,
  initialConcentratedLiquidityState,
} from './concentrated-liquidity-state'

describe('concentratedLiquidityReducer', () => {
  it('updates amount and range fields independently', () => {
    const withAmount = concentratedLiquidityReducer(
      initialConcentratedLiquidityState,
      {
        type: 'typeInput',
        field: Field.CURRENCY_B,
        typedValue: '1.25',
        noLiquidity: false,
      },
    )
    const withRange = concentratedLiquidityReducer(withAmount, {
      type: 'setIndependentRangeField',
      value: Bound.UPPER,
    })

    expect(withRange).toMatchObject({
      independentField: Field.CURRENCY_B,
      independentRangeField: Bound.UPPER,
      typedValue: '1.25',
    })
  })

  it('sets both bounds to full range and resets to initial state', () => {
    const fullRange = concentratedLiquidityReducer(
      initialConcentratedLiquidityState,
      { type: 'setFullRange' },
    )

    expect(fullRange.leftRangeTypedValue).toBe(true)
    expect(fullRange.rightRangeTypedValue).toBe(true)
    expect(
      concentratedLiquidityReducer(fullRange, { type: 'resetMintState' }),
    ).toBe(initialConcentratedLiquidityState)
  })
})
