import { deepStrictEqual, strictEqual } from 'node:assert'
import { describe, it } from 'node:test'
import { DEFAULT_SLIPPAGE } from 'sushi/evm'
import {
  getSlippageToleranceBasisPoints,
  normalizeSlippageTolerance,
} from './slippage-tolerance.ts'

describe('slippage tolerance validation', () => {
  it('converts valid decimal percentages exactly to basis points', () => {
    strictEqual(getSlippageToleranceBasisPoints('.5'), 50)
    strictEqual(getSlippageToleranceBasisPoints('1.00'), 100)
    strictEqual(getSlippageToleranceBasisPoints('50'), 5_000)
    strictEqual(
      getSlippageToleranceBasisPoints('AUTO'),
      getSlippageToleranceBasisPoints(DEFAULT_SLIPPAGE),
    )
  })

  it('rejects partial, zero, excessive, and non-decimal values', () => {
    const invalidValues = [
      '',
      '.',
      '0',
      '0.00',
      '-1',
      '1e1',
      '50.01',
      Number.NaN,
      Number.POSITIVE_INFINITY,
    ]

    deepStrictEqual(
      invalidValues.map(getSlippageToleranceBasisPoints),
      invalidValues.map(() => undefined),
    )
  })

  it('preserves valid display strings and the automatic setting', () => {
    strictEqual(normalizeSlippageTolerance('1.00'), '1.00')
    strictEqual(normalizeSlippageTolerance('AUTO'), 'AUTO')
    strictEqual(normalizeSlippageTolerance('.'), undefined)
  })
})
