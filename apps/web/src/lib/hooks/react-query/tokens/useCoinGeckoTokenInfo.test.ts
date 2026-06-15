import { EvmChainId, EvmToken } from 'sushi/evm'
import { StellarChainId, StellarToken } from 'sushi/stellar'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getCoinGeckoTokenInfoUrl,
  useCoinGeckoTokenInfo,
} from './useCoinGeckoTokenInfo'

const useQueryMock = vi.hoisted(() => vi.fn((options) => options))

vi.mock('@tanstack/react-query', () => ({
  keepPreviousData: Symbol('keepPreviousData'),
  useQuery: useQueryMock,
}))

type CoinGeckoQueryOptions = {
  queryFn: () => Promise<unknown>
  retry?: (failureCount: number, error: Error) => boolean
}

beforeEach(() => {
  useQueryMock.mockClear()
  vi.unstubAllGlobals()
})

describe('getCoinGeckoTokenInfoUrl', () => {
  it('builds Stellar contract URL', () => {
    const token = new StellarToken({
      chainId: StellarChainId.STELLAR,
      address: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 7,
    })

    expect(getCoinGeckoTokenInfoUrl(token)).toBe(
      'https://api.coingecko.com/api/v3/coins/stellar/contract/CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
    )
  })

  it('keeps EVM contract URL behavior', () => {
    const token = new EvmToken({
      chainId: EvmChainId.ETHEREUM,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
    })

    expect(getCoinGeckoTokenInfoUrl(token)).toBe(
      'https://api.coingecko.com/api/v3/coins/eth/contract/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    )
  })

  it('does not retry when CoinGecko returns 404', async () => {
    const token = new EvmToken({
      chainId: EvmChainId.ETHEREUM,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 6,
    })

    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          statusText: 'Not Found',
        }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const queryOptions = useCoinGeckoTokenInfo({
      token,
    }) as unknown as CoinGeckoQueryOptions

    const error = await queryOptions.queryFn().then(
      () => undefined,
      (caught: unknown) => caught,
    )

    expect(error).toBeInstanceOf(Error)
    expect(error).toMatchObject({ status: 404 })

    if (!(error instanceof Error)) throw new Error('Expected query to fail')

    expect(queryOptions.retry?.(0, error)).toBe(false)
    expect(fetchMock).toHaveBeenCalledOnce()
  })
})
