import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createCrossmintOrder } from './create-crossmint-order'

const SOLANA_WALLET = '11111111111111111111111111111111'
const BASE_USDC = {
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  chainId: 8453,
  symbol: 'USDC',
} as const
const SOLANA_XMEME = {
  address: '7EivYFyNfgGj8xbUymR7J4LuxUHLKRzpLaERHLvi7Dgu',
  chainId: -5,
  symbol: 'XMEME',
} as const

describe('createCrossmintOrder', () => {
  beforeEach(() => {
    vi.stubEnv('CROSSMINT_SERVER_SIDE_API_KEY', 'sk_staging_example')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('creates a staging fungible-token order for an external wallet', async () => {
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(
          JSON.stringify({
            clientSecret: 'client-secret',
            order: { orderId: 'order-id' },
          }),
          { status: 201 },
        ),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      createCrossmintOrder({
        amountUsd: '5',
        receiptEmail: 'buyer@example.com',
        token: SOLANA_XMEME,
        walletAddress: SOLANA_WALLET,
      }),
    ).resolves.toEqual({
      clientSecret: 'client-secret',
      orderId: 'order-id',
    })

    const [url, init] = fetchMock.mock.calls[0]
    const body = JSON.parse(String(init?.body))

    expect(url).toBe('https://staging.crossmint.com/api/2022-06-09/orders')
    expect(init?.headers).toMatchObject({
      'X-API-KEY': 'sk_staging_example',
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(body).toMatchObject({
      lineItems: [
        {
          executionParameters: {
            amount: '5',
            maxSlippageBps: '500',
            mode: 'exact-in',
          },
          tokenLocator: 'solana:7EivYFyNfgGj8xbUymR7J4LuxUHLKRzpLaERHLvi7Dgu',
        },
      ],
      payment: {
        currency: 'usd',
        method: 'card',
        receiptEmail: 'buyer@example.com',
      },
      recipient: { walletAddress: SOLANA_WALLET },
    })
  })

  it('links an external wallet before creating an onramp order', async () => {
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, _init?: RequestInit) => {
        if (String(input).includes('/linked-wallets/')) {
          return new Response(
            JSON.stringify({
              address: '0x0000000000000000000000000000000000000001',
              chain: 'base-sepolia',
              ownership: { verified: false },
              type: 'external-wallet',
            }),
            { status: 200 },
          )
        }

        return new Response(
          JSON.stringify({
            clientSecret: 'client-secret',
            order: { orderId: 'order-id' },
          }),
          { status: 201 },
        )
      },
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      createCrossmintOrder({
        amountUsd: '5',
        receiptEmail: 'buyer+onramp@example.com',
        token: BASE_USDC,
        walletAddress: '0x0000000000000000000000000000000000000001',
      }),
    ).resolves.toEqual({
      clientSecret: 'client-secret',
      orderId: 'order-id',
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    const [linkUrl, linkInit] = fetchMock.mock.calls[0]
    const [orderUrl] = fetchMock.mock.calls[1]

    expect(linkUrl).toBe(
      'https://staging.crossmint.com/api/2025-06-09/users/email%3Abuyer%2Bonramp%40example.com/linked-wallets/0x0000000000000000000000000000000000000001',
    )
    expect(linkInit).toMatchObject({
      method: 'PUT',
      headers: { 'X-API-KEY': 'sk_staging_example' },
    })
    expect(JSON.parse(String(linkInit?.body))).toEqual({
      chain: 'base-sepolia',
    })
    expect(orderUrl).toBe('https://staging.crossmint.com/api/2022-06-09/orders')
  })

  it('does not create an onramp order when wallet linking fails', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ message: 'Wallet could not be linked' }),
          {
            status: 400,
          },
        ),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      createCrossmintOrder({
        amountUsd: '5',
        receiptEmail: 'buyer@example.com',
        token: BASE_USDC,
        walletAddress: '0x0000000000000000000000000000000000000001',
      }),
    ).rejects.toThrow('Crossmint request failed: Wallet could not be linked')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('returns the receive range and total price used by the review dialog', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              clientSecret: 'client-secret',
              order: {
                lineItems: [
                  {
                    quote: {
                      quantityRange: {
                        lowerBound: '49.5',
                        upperBound: '50',
                      },
                    },
                  },
                ],
                orderId: 'order-id',
                quote: {
                  expiresAt: '2026-08-27T20:14:09.957Z',
                  totalPrice: { amount: '50', currency: 'usd' },
                },
              },
            }),
            { status: 201 },
          ),
      ),
    )

    await expect(
      createCrossmintOrder({
        amountUsd: '50',
        paymentCurrency: 'eur',
        receiptEmail: 'buyer@example.com',
        token: SOLANA_XMEME,
        walletAddress: SOLANA_WALLET,
      }),
    ).resolves.toMatchObject({
      quote: {
        expiresAt: '2026-08-27T20:14:09.957Z',
        receiveAmount: { lowerBound: '49.5', upperBound: '50' },
        totalPrice: { amount: '50', currency: 'usd' },
      },
    })
  })

  it('returns an order session when Crossmint requires recipient verification', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              clientSecret: 'client-secret',
              order: {
                orderId: 'order-id',
                payment: {
                  preparation: { message: 'Sign this challenge' },
                  status: 'requires-recipient-verification',
                },
              },
            }),
            { status: 201 },
          ),
      ),
    )

    await expect(
      createCrossmintOrder({
        amountUsd: '1000',
        receiptEmail: 'buyer@example.com',
        token: BASE_USDC,
        walletAddress: '0x0000000000000000000000000000000000000001',
      }),
    ).resolves.toEqual({
      clientSecret: 'client-secret',
      orderId: 'order-id',
    })
  })

  it('accepts a KYC preparation without a wallet verification message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              clientSecret: 'client-secret',
              order: {
                orderId: 'order-id',
                payment: {
                  preparation: { type: 'kyc' },
                  status: 'requires-kyc',
                },
              },
            }),
            { status: 201 },
          ),
      ),
    )

    await expect(
      createCrossmintOrder({
        amountUsd: '5',
        receiptEmail: 'buyer@example.com',
        token: BASE_USDC,
        walletAddress: '0x0000000000000000000000000000000000000001',
      }),
    ).resolves.toEqual({
      clientSecret: 'client-secret',
      orderId: 'order-id',
    })
  })

  it('rejects an address that does not match the target network', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      createCrossmintOrder({
        amountUsd: '5',
        receiptEmail: 'buyer@example.com',
        token: BASE_USDC,
        walletAddress: SOLANA_WALLET,
      }),
    ).rejects.toThrow('Invalid Base Sepolia recipient wallet address')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
