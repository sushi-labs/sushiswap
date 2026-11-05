import { Fraction } from 'sushi'
import { describe, expect, it } from 'vitest'
import { formatStartPrice, formatTypedPriceNumber } from './range-prices'

const DECIMAL = /^\d*\.?\d+$/

describe('formatStartPrice', () => {
  it('keeps the significant digits of small prices', () => {
    const price = new Fraction({ numerator: 1n, denominator: 10n ** 8n })
    expect(formatStartPrice(price)).toBe('0.00000001')
  })

  it('gives a plain decimal for large prices', () => {
    const price = new Fraction({ numerator: 123456789012n, denominator: 1n })
    expect(formatStartPrice(price)).toMatch(DECIMAL)
  })
})

describe('formatTypedPriceNumber', () => {
  it.each([1.2345e-8, 0.000123, 123456.7, 1.5e25])(
    'gives a plain decimal for %d',
    (value) => {
      const result = formatTypedPriceNumber(value)
      expect(result).toMatch(DECIMAL)
      expect(Math.abs(Number(result) / value - 1)).toBeLessThan(1e-7)
    },
  )
})

describe('formatStartPrice precision', () => {
  it('survives inverting twice', () => {
    const price = new Fraction({
      numerator: 12345678912345n,
      denominator: 10n ** 10n,
    })
    const inverted = formatStartPrice(price.invert())
    const [whole, fraction = ''] = inverted.split('.')
    const back = new Fraction({
      numerator: BigInt(`${whole}${fraction}`),
      denominator: 10n ** BigInt(fraction.length),
    }).invert()
    expect(formatStartPrice(back)).toBe('1234.5678912345')
  })
})
