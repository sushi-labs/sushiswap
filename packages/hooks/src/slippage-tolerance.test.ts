import { DEFAULT_SLIPPAGE } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import {
  getSlippageToleranceBasisPoints,
  normalizeSlippageTolerance,
} from './slippage-tolerance'

describe('slippage tolerance', () => {
  it.each([
    ['0.01', 1],
    ['0.5', 50],
    ['.5', 50],
    ['1', 100],
    ['1.00', 100],
    ['50', 5_000],
    [50, 5_000],
  ])('converts %s to basis points', (value, expected) => {
    expect(getSlippageToleranceBasisPoints(value)).toBe(expected)
  })

  it('resolves AUTO to the default slippage', () => {
    expect(getSlippageToleranceBasisPoints('AUTO')).toBe(
      getSlippageToleranceBasisPoints(DEFAULT_SLIPPAGE),
    )
  })

  it.each([
    '',
    '.',
    0,
    '0',
    '0.00',
    '-1',
    '0.001',
    '1e1',
    '100.01',
    101,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    null,
    undefined,
  ])('rejects unsupported value %s', (value) => {
    expect(getSlippageToleranceBasisPoints(value)).toBeUndefined()
  })

  it('preserves automatic slippage and normalized valid inputs', () => {
    expect(normalizeSlippageTolerance('AUTO')).toBe('AUTO')
    expect(normalizeSlippageTolerance('0.5')).toBe('0.5')
    expect(normalizeSlippageTolerance('1.00')).toBe('1.00')
    expect(normalizeSlippageTolerance('.')).toBeUndefined()
  })
})
