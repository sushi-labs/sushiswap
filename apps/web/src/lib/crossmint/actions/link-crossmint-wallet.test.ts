import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { linkCrossmintWallet } from './link-crossmint-wallet'

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

describe('linkCrossmintWallet', () => {
  beforeEach(() => {
    vi.stubEnv('CROSSMINT_SERVER_SIDE_API_KEY', 'sk_staging_example')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('links an external wallet to the Crossmint email user', async () => {
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(
          JSON.stringify({
            ownership: {
              verificationChallenge: 'Sign this challenge',
              verified: false,
            },
          }),
          { status: 200 },
        ),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      linkCrossmintWallet({
        receiptEmail: 'buyer@example.com',
        token: BASE_USDC,
        walletAddress: '0x0000000000000000000000000000000000000001',
      }),
    ).resolves.toEqual({
      verificationChallenge: 'Sign this challenge',
      verified: false,
    })

    const [url, init] = fetchMock.mock.calls[0]

    expect(url).toBe(
      'https://staging.crossmint.com/api/2025-06-09/users/email%3Abuyer%40example.com/linked-wallets/0x0000000000000000000000000000000000000001',
    )
    expect(JSON.parse(String(init?.body))).toEqual({
      chain: 'base-sepolia',
    })
  })

  it('does not link wallet addresses for ordinary checkout targets', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      linkCrossmintWallet({
        receiptEmail: 'buyer@example.com',
        token: SOLANA_XMEME,
        walletAddress: '11111111111111111111111111111111',
      }),
    ).rejects.toThrow('does not require wallet linking')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
