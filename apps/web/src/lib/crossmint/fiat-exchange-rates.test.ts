import { describe, expect, it } from 'vitest'
import {
  convertFiatToUsdAmount,
  convertUsdToWholeFiatAmount,
  createFiatExchangeRatesResponse,
  parseFiatExchangeRatesResponse,
} from './fiat-exchange-rates'

const DATE = '2026-08-26'
const FRANKFURTER_RESPONSE = [
  { base: 'USD', date: DATE, quote: 'AUD', rate: 1.3963 },
  { base: 'USD', date: DATE, quote: 'EUR', rate: 0.85656 },
  { base: 'USD', date: DATE, quote: 'GBP', rate: 0.73383 },
  { base: 'USD', date: DATE, quote: 'HKD', rate: 7.8453 },
  { base: 'USD', date: DATE, quote: 'INR', rate: 95.48 },
  { base: 'USD', date: DATE, quote: 'JPY', rate: 159.21 },
  { base: 'USD', date: DATE, quote: 'KRW', rate: 1383.61 },
  { base: 'USD', date: DATE, quote: 'SGD', rate: 1.2702 },
  { base: 'USD', date: DATE, quote: 'VND', rate: 26067 },
] as const

describe('fiat exchange rates', () => {
  it('normalizes the upstream response into typed lowercase rates', () => {
    expect(createFiatExchangeRatesResponse(FRANKFURTER_RESPONSE)).toEqual({
      base: 'usd',
      date: DATE,
      rates: {
        aud: 1.3963,
        eur: 0.85656,
        gbp: 0.73383,
        hkd: 7.8453,
        inr: 95.48,
        jpy: 159.21,
        krw: 1383.61,
        sgd: 1.2702,
        usd: 1,
        vnd: 26067,
      },
    })
  })

  it('rejects responses missing a supported currency', () => {
    expect(() =>
      createFiatExchangeRatesResponse(FRANKFURTER_RESPONSE.slice(1)),
    ).toThrow()
  })

  it('rejects malformed internal API responses', () => {
    expect(() =>
      parseFiatExchangeRatesResponse({
        base: 'usd',
        date: DATE,
        rates: { usd: 1 },
      }),
    ).toThrow()
  })

  it('rounds USD presets to whole target-currency amounts', () => {
    expect(convertUsdToWholeFiatAmount(10, 1)).toBe('10')
    expect(convertUsdToWholeFiatAmount(10, 0.85656)).toBe('9')
    expect(convertUsdToWholeFiatAmount(25, 159.21)).toBe('3980')
  })

  it('converts a selected payment amount back to a USD order amount', () => {
    expect(convertFiatToUsdAmount(10, 1)).toBe('10.00')
    expect(convertFiatToUsdAmount(9, 0.85656)).toBe('10.51')
    expect(convertFiatToUsdAmount(3980, 159.21)).toBe('25.00')
  })

  it('rejects unusable amounts and rates', () => {
    expect(() => convertUsdToWholeFiatAmount(Number.NaN, 1)).toThrow()
    expect(() => convertUsdToWholeFiatAmount(10, 0)).toThrow()
    expect(() => convertFiatToUsdAmount(0, 1)).toThrow()
    expect(() => convertFiatToUsdAmount(10, 0)).toThrow()
  })
})
