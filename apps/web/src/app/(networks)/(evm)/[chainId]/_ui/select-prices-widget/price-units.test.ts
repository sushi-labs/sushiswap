import { describe, expect, it } from 'vitest'
import { isUsableUsdPrice, toDisplayPrice, toPairPrice } from './price-units'

describe('USD price conversion', () => {
  it('converts dollar prices into token units without floating-point rounding', () => {
    const units = { inverted: false, usdPrice: 2400 }
    expect(toPairPrice('0.18', units)).toBe('0.000075')
    expect(toPairPrice('1.2', units)).toBe('0.0005')
    expect(toDisplayPrice('0.000075', units)).toBe('0.18')
    expect(toDisplayPrice('0.0005', { ...units, usdPrice: 3000 })).toBe('1.5')
    expect(toPairPrice('0.3', { inverted: false, usdPrice: 0.1 })).toBe('3')
  })

  it('handles reverse price orientation and small decimal prices', () => {
    expect(toPairPrice('960', { inverted: true, usdPrice: 0.48 })).toBe(
      '0.0005',
    )
    expect(toDisplayPrice('0.0005', { inverted: true, usdPrice: 0.48 })).toBe(
      '960',
    )
    expect(
      toPairPrice('0.000000000000000001', { inverted: false, usdPrice: 1e-20 }),
    ).toBe('100')
    expect(toPairPrice('0.000000000000000001', { inverted: false })).toBe(
      '0.000000000000000001',
    )
  })

  it.each([undefined, 0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'does not treat an unavailable USD quote as a zero-dollar price: %s',
    (price) => expect(isUsableUsdPrice(price)).toBe(false),
  )

  it.each([
    '',
    '.',
    '0',
    '-1',
    'Infinity',
    'NaN',
    '1e3',
    '1.2.3',
    '1'.repeat(401),
  ])('invalidates unsupported price input: %s', (value) =>
    expect(toPairPrice(value, { inverted: false, usdPrice: 2400 })).toBe(''),
  )

  it('rejects conversions that exceed the existing tick parser’s numeric limits', () => {
    expect(
      toPairPrice('0.0000000001', {
        inverted: false,
        usdPrice: Number.MAX_VALUE,
      }),
    ).toBe('')
    expect(
      toPairPrice('1', { inverted: false, usdPrice: Number.MIN_VALUE }),
    ).toBe('')
    expect(toPairPrice(`0.${'0'.repeat(309)}1`, { inverted: false })).toBe('')
  })

  it('rejects invalid conversion factors rather than silently using token units', () => {
    expect(toPairPrice('1', { inverted: false, usdPrice: 0 })).toBe('')
    expect(toDisplayPrice('1', { inverted: false, usdPrice: Number.NaN })).toBe(
      '',
    )
  })
})
