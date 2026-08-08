import { describe, expect, it } from 'vitest'
import {
  AUTO_SLIPPAGE_MAX_BASIS_POINTS,
  AUTO_SLIPPAGE_MIN_BASIS_POINTS,
  getAutoSlippageToleranceBasisPoints,
} from './auto-slippage'

describe('getAutoSlippageToleranceBasisPoints', () => {
  it('uses the minimum when gas cost is small relative to the trade', () => {
    expect(
      getAutoSlippageToleranceBasisPoints({
        gasCostUsd: 1,
        tradeValueUsd: 1_000,
      }),
    ).toBe(AUTO_SLIPPAGE_MIN_BASIS_POINTS)
  })

  it('uses the gas-cost-to-trade-value ratio within the clamp', () => {
    expect(
      getAutoSlippageToleranceBasisPoints({
        gasCostUsd: 2,
        tradeValueUsd: 100,
      }),
    ).toBe(200)
  })

  it('rounds up to the next basis point', () => {
    expect(
      getAutoSlippageToleranceBasisPoints({
        gasCostUsd: '0.501',
        tradeValueUsd: '100',
      }),
    ).toBe(51)
  })

  it('uses the maximum when gas cost is large relative to the trade', () => {
    expect(
      getAutoSlippageToleranceBasisPoints({
        gasCostUsd: 10,
        tradeValueUsd: 100,
      }),
    ).toBe(AUTO_SLIPPAGE_MAX_BASIS_POINTS)
  })

  it.each([
    { gasCostUsd: undefined, tradeValueUsd: 100 },
    { gasCostUsd: Number.NaN, tradeValueUsd: 100 },
    { gasCostUsd: 1, tradeValueUsd: undefined },
    { gasCostUsd: 1, tradeValueUsd: 0 },
    { gasCostUsd: 1, tradeValueUsd: Number.POSITIVE_INFINITY },
  ])('uses the minimum for unavailable values: %o', (params) => {
    expect(getAutoSlippageToleranceBasisPoints(params)).toBe(
      AUTO_SLIPPAGE_MIN_BASIS_POINTS,
    )
  })
})
