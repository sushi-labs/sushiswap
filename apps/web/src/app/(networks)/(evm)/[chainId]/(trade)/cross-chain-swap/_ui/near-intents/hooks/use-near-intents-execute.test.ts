import { Amount } from 'sushi'
import { STELLAR_XLM, StellarChainId } from 'sushi/stellar'
import { describe, expect, it, vi } from 'vitest'
import type { NearIntentsQuoteResponse } from '~evm/api/cross-chain/near-intents/schemas'

vi.mock('src/lib/wallet/namespaces/stellar/config', () => ({
  stellarWalletKit: undefined,
}))

import { assertExecutableQuoteIsSafe } from './use-near-intents-execute'

const baseQuote = {
  correlationId: 'correlation-id',
  timestamp: '2024-01-01T00:00:00Z',
  signature: 'signature',
  quote: {
    amountIn: '1000',
    amountInFormatted: '1000',
    amountInUsd: '1',
    minAmountIn: '1000',
    amountOut: '900',
    amountOutFormatted: '900',
    amountOutUsd: '0.9',
    minAmountOut: '850',
    timeEstimate: 60,
  },
} satisfies NearIntentsQuoteResponse

describe('assertExecutableQuoteIsSafe', () => {
  it('accepts an executable quote matching the previewed input amount', () => {
    expect(() =>
      assertExecutableQuoteIsSafe({
        executableQuote: baseQuote,
        previewQuote: baseQuote,
        requestedAmountIn: baseQuote.quote.amountIn,
      }),
    ).not.toThrow()
  })

  it('rejects an executable quote with a different selected input amount', () => {
    expect(() =>
      assertExecutableQuoteIsSafe({
        executableQuote: baseQuote,
        previewQuote: baseQuote,
        requestedAmountIn: '1001',
      }),
    ).toThrow('Executable quote amount does not match selected input amount')
  })

  it('rejects an executable quote with a different input amount', () => {
    expect(() =>
      assertExecutableQuoteIsSafe({
        executableQuote: {
          ...baseQuote,
          quote: { ...baseQuote.quote, amountIn: '1001' },
        },
        previewQuote: baseQuote,
        requestedAmountIn: '1001',
      }),
    ).toThrow('Executable quote amount does not match previewed amount')
  })

  it('accepts executable quote minimum output drift from refreshed quote', () => {
    expect(() =>
      assertExecutableQuoteIsSafe({
        executableQuote: {
          ...baseQuote,
          quote: { ...baseQuote.quote, minAmountOut: '849' },
        },
        previewQuote: baseQuote,
        requestedAmountIn: baseQuote.quote.amountIn,
      }),
    ).not.toThrow()
  })
})

describe('Stellar raw quote amount conversion', () => {
  it('converts raw quote amount to the human decimal string expected by Stellar payments', () => {
    const amount = new Amount(STELLAR_XLM[StellarChainId.STELLAR], '35000')

    expect(amount.toString()).toBe('0.0035')
  })
})
