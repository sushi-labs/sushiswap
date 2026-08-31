import { describe, expect, it } from 'vitest'
import {
  CROSSMINT_STAGING_FALLBACK_TOKEN_PRICE_USD,
  formatFiatBuyTokenAmount,
  formatFiatBuyTokenInputAmount,
  getFiatBuyPaymentAmount,
  getFiatBuyTokenEstimate,
} from './fiat-buy-token-estimate'

describe('getFiatBuyTokenEstimate', () => {
  it('uses a valid Sushi price in staging', () => {
    expect(
      getFiatBuyTokenEstimate({
        amountUsd: 25,
        environment: 'staging',
        sushiTokenPrice: 0.001,
      }),
    ).toEqual({
      amount: 25_000,
      priceUsd: 0.001,
      usesStagingFallback: false,
    })
  })

  it('uses the staging fallback when Sushi has no price', () => {
    expect(
      getFiatBuyTokenEstimate({
        amountUsd: 25,
        environment: 'staging',
        sushiTokenPrice: undefined,
      }),
    ).toEqual({
      amount: 25 / CROSSMINT_STAGING_FALLBACK_TOKEN_PRICE_USD,
      priceUsd: CROSSMINT_STAGING_FALLBACK_TOKEN_PRICE_USD,
      usesStagingFallback: true,
    })
  })

  it('waits for Sushi before using the staging fallback', () => {
    expect(
      getFiatBuyTokenEstimate({
        allowStagingFallback: false,
        amountUsd: 25,
        environment: 'staging',
        sushiTokenPrice: undefined,
      }),
    ).toEqual({ usesStagingFallback: false })
  })

  it('does not use the fallback in production', () => {
    expect(
      getFiatBuyTokenEstimate({
        amountUsd: 25,
        environment: 'production',
        sushiTokenPrice: undefined,
      }),
    ).toEqual({ usesStagingFallback: false })
  })
})

describe('formatFiatBuyTokenAmount', () => {
  it('formats the shared estimate consistently', () => {
    expect(formatFiatBuyTokenAmount(50_000, 'en-US')).toBe('50,000')
  })
})

describe('formatFiatBuyTokenInputAmount', () => {
  it('formats an editable amount without grouping separators', () => {
    expect(formatFiatBuyTokenInputAmount(50_000)).toBe('50000')
  })
})

describe('getFiatBuyPaymentAmount', () => {
  it('converts a token amount into USD', () => {
    expect(
      getFiatBuyPaymentAmount({
        exchangeRate: 1,
        minorUnits: 2,
        tokenAmount: '50',
        tokenPriceUsd: 1,
      }),
    ).toBe('50')
  })

  it('converts a token amount into the selected fiat currency', () => {
    expect(
      getFiatBuyPaymentAmount({
        exchangeRate: 0.85656,
        minorUnits: 2,
        tokenAmount: '50',
        tokenPriceUsd: 1,
      }),
    ).toBe('42.83')
  })

  it('uses the token price for non-stablecoins', () => {
    expect(
      getFiatBuyPaymentAmount({
        exchangeRate: 1,
        minorUnits: 2,
        tokenAmount: '50',
        tokenPriceUsd: 0.5,
      }),
    ).toBe('25')
  })

  it('clears zero and empty amounts', () => {
    expect(
      getFiatBuyPaymentAmount({
        exchangeRate: 1,
        minorUnits: 2,
        tokenAmount: '',
        tokenPriceUsd: 1,
      }),
    ).toBe('')
    expect(
      getFiatBuyPaymentAmount({
        exchangeRate: 1,
        minorUnits: 2,
        tokenAmount: '0',
        tokenPriceUsd: 1,
      }),
    ).toBe('')
  })
})
