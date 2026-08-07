import { describe, expect, it } from 'vitest'
import {
  getSlippageToleranceBasisPoints,
  normalizeSlippageTolerance,
} from './slippage-tolerance'

describe('slippage tolerance', () => {
  it.each([
    ['0.01', 1],
    ['0.5', 50],
    ['1', 100],
    [50, 5_000],
  ])('converts %s to basis points', (value, expected) => {
    expect(getSlippageToleranceBasisPoints(value)).toBe(expected)
  })

  it.each([0, '0', '-1', '0.001', '50.01', 51, null, undefined])(
    'rejects unsupported value %s',
    (value) => {
      expect(getSlippageToleranceBasisPoints(value)).toBeUndefined()
    },
  )

  it('preserves automatic slippage and normalized valid inputs', () => {
    expect(normalizeSlippageTolerance('AUTO')).toBe('AUTO')
    expect(normalizeSlippageTolerance('0.5')).toBe('0.5')
  })
})
