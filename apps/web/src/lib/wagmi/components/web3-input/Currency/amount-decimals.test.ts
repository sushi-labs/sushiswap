import { describe, expect, it } from 'vitest'
import { truncateAmountToDecimals } from './amount-decimals'

describe('truncateAmountToDecimals', () => {
  it('preserves large integers while truncating excess precision', () => {
    expect(truncateAmountToDecimals('123456789012345678.123456789', 6)).toBe(
      '123456789012345678.123456',
    )
  })

  it('rounds down instead of using parseUnits rounding', () => {
    expect(truncateAmountToDecimals('1.999', 2)).toBe('1.99')
    expect(truncateAmountToDecimals('999.9', 0)).toBe('999')
  })

  it('leaves representable drafts unchanged', () => {
    expect(truncateAmountToDecimals('.1', 6)).toBe('.1')
    expect(truncateAmountToDecimals('1.2', 6)).toBe('1.2')
  })

  it('rejects exponent and malformed syntax', () => {
    expect(truncateAmountToDecimals('1e21', 6)).toBeUndefined()
    expect(truncateAmountToDecimals('.', 6)).toBeUndefined()
  })
})
