import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('./crossmint-config', async (importOriginal) => {
  const config = await importOriginal<typeof import('./crossmint-config')>()

  return {
    ...config,
    CROSSMINT_CLIENT_SIDE_API_KEY: 'ck_staging_example',
  }
})

import {
  fetchCrossmintCheckoutTokensPage,
  getAvailableCrossmintCheckoutTokens,
} from './crossmint-checkout-tokens'

const TOKENS_RESPONSE = {
  data: [
    {
      available: true,
      features: { creditCardPayment: true },
      token: 'solana:available-token',
    },
    {
      available: false,
      features: { creditCardPayment: true },
      token: 'base:unavailable-token',
    },
  ],
  nextCursor: 'next-page',
  previousCursor: null,
} as const

describe('Crossmint checkout tokens', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests a typed staging page with the supported filters', async () => {
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        Promise.resolve(
          new Response(JSON.stringify(TOKENS_RESPONSE), { status: 200 }),
        ),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      fetchCrossmintCheckoutTokensPage({
        chains: ['solana', 'base'],
        cursor: 'current-page',
        limit: 100,
        tokenClasses: ['memecoin', 'onramp'],
      }),
    ).resolves.toEqual({
      ...TOKENS_RESPONSE,
      previousCursor: undefined,
    })

    const [input, init] = fetchMock.mock.calls[0]
    const url = new URL(String(input))

    expect(url.origin).toBe('https://staging.crossmint.com')
    expect(url.pathname).toBe('/api/2024-09-26/tokens')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      chains: 'solana,base',
      cursor: 'current-page',
      limit: '100',
      tokenClasses: 'memecoin,onramp',
    })
    expect(init?.headers).toEqual({
      'X-API-KEY': 'ck_staging_example',
    })
  })

  it('flattens pages and excludes tokens that are not available', () => {
    expect(
      getAvailableCrossmintCheckoutTokens([
        {
          data: [...TOKENS_RESPONSE.data],
          nextCursor: TOKENS_RESPONSE.nextCursor,
        },
        {
          data: [
            {
              available: true,
              features: { creditCardPayment: false },
              token: 'ethereum:another-token',
            },
          ],
        },
      ]),
    ).toEqual([
      TOKENS_RESPONSE.data[0],
      {
        available: true,
        features: { creditCardPayment: false },
        token: 'ethereum:another-token',
      },
    ])
  })

  it('rejects malformed API responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              data: [{ available: true, token: 'solana:token' }],
            }),
          ),
        ),
      ),
    )

    await expect(fetchCrossmintCheckoutTokensPage({})).rejects.toThrow()
  })
})
