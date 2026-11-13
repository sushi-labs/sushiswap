import { EvmChainId } from 'sushi/evm'
import { StellarChainId } from 'sushi/stellar'
import { SvmChainId } from 'sushi/svm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CrossChainSwapPage from './page'

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn((_url: string): never => {
    throw new Error('redirect')
  }),
}))

vi.mock('next/navigation', () => ({
  redirect,
  notFound: (): never => {
    throw new Error('not found')
  },
}))

async function redirectFrom(
  chainId: number,
  searchParams: Record<string, string | string[] | undefined> = {},
): Promise<URL> {
  await expect(
    CrossChainSwapPage({
      params: Promise.resolve({ chainId: String(chainId) }),
      searchParams: Promise.resolve(searchParams),
    }),
  ).rejects.toThrow('redirect')
  const location = redirect.mock.lastCall?.[0]
  if (!location) throw new Error('Expected a redirect URL')
  return new URL(location, 'https://www.sushi.com')
}

describe('legacy cross-chain swap redirects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('preserves Ethereum as the default destination for Stellar', async () => {
    const url = await redirectFrom(StellarChainId.STELLAR)
    expect(url.pathname).toBe('/stellar/swap')
    expect(url.searchParams.get('chainId1')).toBe(String(EvmChainId.ETHEREUM))
  })

  it.each([
    [EvmChainId.ETHEREUM, 'ethereum', EvmChainId.ARBITRUM],
    [EvmChainId.ARBITRUM, 'arbitrum', EvmChainId.ETHEREUM],
    [EvmChainId.BASE, 'base', EvmChainId.ARBITRUM],
  ] as const)(
    'preserves the EVM default destination for %s',
    async (chainId, network, destination) => {
      const url = await redirectFrom(chainId)
      expect(url.pathname).toBe(`/${network}/swap`)
      expect(url.searchParams.get('chainId1')).toBe(String(destination))
    },
  )

  it('preserves explicit networks, tokens, amount, and unrelated query parameters', async () => {
    const search = {
      chainId0: String(EvmChainId.BASE),
      chainId1: String(SvmChainId.SOLANA),
      token0: 'NATIVE',
      token1: 'NATIVE',
      swapAmount: '0.25',
      referrer: ['first-campaign', 'second-campaign'],
    }
    const url = await redirectFrom(EvmChainId.ETHEREUM, search)
    expect(url.pathname).toBe('/ethereum/swap')
    for (const [key, value] of Object.entries(search)) {
      expect(url.searchParams.getAll(key)).toEqual(
        Array.isArray(value) ? value : [value],
      )
    }
  })
})
