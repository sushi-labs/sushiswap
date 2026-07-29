import { EvmChainId } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import {
  directPoolQuoteInputSchema,
  directPoolQuoteResponseSchema,
  getDirectPoolQuoteUrl,
} from './api'

const tokenIn = '0x4200000000000000000000000000000000000006'
const tokenOut = '0x66175075f60c893456ee6a0237ed0f548a9023a2'

describe('direct pool quote API', () => {
  it('builds a cacheable quote URL from valid parameters', () => {
    const url = new URL(
      getDirectPoolQuoteUrl({
        chainId: EvmChainId.ROBINHOOD,
        tokenIn,
        tokenOut,
        amount: '100000000000000000',
        feeTier: 10_000,
      }),
      'https://www.sushi.com',
    )

    expect(url.pathname).toBe('/api/direct-pool/quote')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      chainId: EvmChainId.ROBINHOOD.toString(),
      tokenIn,
      tokenOut,
      amount: '100000000000000000',
      feeTier: '10000',
    })
  })

  it('rejects unsupported chains and invalid quote parameters', () => {
    expect(
      directPoolQuoteInputSchema.safeParse({
        chainId: EvmChainId.ETHEREUM,
        tokenIn,
        tokenOut,
        amount: '100000000000000000',
        feeTier: 10_000,
      }).success,
    ).toBe(false)
    expect(
      directPoolQuoteInputSchema.safeParse({
        chainId: EvmChainId.ROBINHOOD,
        tokenIn: 'not-an-address',
        tokenOut,
        amount: 'not-an-amount',
        feeTier: 2 ** 24,
      }).success,
    ).toBe(false)
  })

  it('accepts bigint quote fields encoded as decimal strings', () => {
    expect(
      directPoolQuoteResponseSchema.parse({
        amountOut: '123456789',
        gasEstimate: '98765',
      }),
    ).toEqual({
      amountOut: '123456789',
      gasEstimate: '98765',
    })
  })
})
