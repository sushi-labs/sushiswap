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
      verificationMessage: undefined,
    })

    const [url, init] = fetchMock.mock.calls[0]
    const body = JSON.parse(String(init?.body))

    expect(url).toBe('https://staging.crossmint.com/api/2022-06-09/orders')
    expect(init?.headers).toMatchObject({
      'X-API-KEY': 'sk_staging_example',
    })
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
      recipient: { walletAddress: SOLANA_WALLET },
    })
  })

  it('returns an external-wallet verification challenge when required', async () => {
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
    ).resolves.toMatchObject({
      verificationMessage: 'Sign this challenge',
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
      verificationMessage: undefined,
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
