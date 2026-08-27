import { describe, expect, it } from 'vitest'
import {
  getCrossmintAvailableFiatPaymentMethods,
  isCrossmintGooglePayUserAgent,
} from './crossmint-payment-methods'

const allMethods = {
  applePay: true,
  card: true,
  googlePay: true,
}

describe('getCrossmintAvailableFiatPaymentMethods', () => {
  it('prefers Apple Pay before card when available', () => {
    expect(
      getCrossmintAvailableFiatPaymentMethods(allMethods, {
        applePay: true,
        googlePay: false,
      }),
    ).toEqual(['applePay', 'card'])
  })

  it('prefers Google Pay before card when available', () => {
    expect(
      getCrossmintAvailableFiatPaymentMethods(allMethods, {
        applePay: false,
        googlePay: true,
      }),
    ).toEqual(['googlePay', 'card'])
  })

  it('falls back to card outside supported digital-wallet browsers', () => {
    expect(
      getCrossmintAvailableFiatPaymentMethods(allMethods, {
        applePay: false,
        googlePay: false,
      }),
    ).toEqual(['card'])
  })

  it('returns no methods when the asset supports none', () => {
    expect(
      getCrossmintAvailableFiatPaymentMethods(
        { applePay: false, card: false, googlePay: false },
        { applePay: true, googlePay: true },
      ),
    ).toEqual([])
  })
})

describe('isCrossmintGooglePayUserAgent', () => {
  it('recognizes Chrome and Android browsers', () => {
    expect(isCrossmintGooglePayUserAgent('Chrome/140.0.0.0')).toBe(true)
    expect(isCrossmintGooglePayUserAgent('Android 16')).toBe(true)
  })

  it('does not select Google Pay for Firefox', () => {
    expect(isCrossmintGooglePayUserAgent('Firefox/142.0')).toBe(false)
  })
})
