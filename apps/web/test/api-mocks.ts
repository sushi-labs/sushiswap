import { NativeAddress } from 'src/lib/constants'
import {
  EvmChainId,
  EvmNative,
  type EvmToken,
  SUSHI,
  USDC,
  USDT,
  WBTC,
} from 'sushi/evm'
import * as z from 'zod'
import { chainId } from './constants'
import type { Fork } from './fixtures'
import { currencyBalance } from './fork'
import type { NetworkMocks } from './intercept-anvil'

export const graphRequest = z.object({
  operationName: z.string(),
  variables: z.record(z.string(), z.unknown()).default({}),
})

export function installApiMocks(mocks: NetworkMocks, fork: Fork): void {
  const native = EvmNative.fromChainId(chainId)
  const tokens = [
    native.wrap(),
    USDC[chainId],
    USDT[chainId],
    WBTC[chainId],
    SUSHI[chainId],
    fork.token,
  ]
  const browseNetworks = [EvmChainId.BASE, EvmChainId.ETHEREUM] as const

  function tokenFixture(requestedChainId: unknown): {
    native: EvmNative
    tokens: EvmToken[]
    forkBalances: boolean
  } {
    const requested = Number(requestedChainId)
    if (requested === chainId) return { native, tokens, forkBalances: true }
    const browseChain = browseNetworks.find((network) => network === requested)
    if (browseChain === undefined)
      throw new Error(`Unmocked token-list chain: ${String(requestedChainId)}`)
    const browseNative = EvmNative.fromChainId(browseChain)
    return {
      native: browseNative,
      tokens: [browseNative.wrap(), USDC[browseChain]],
      forkBalances: false,
    }
  }

  mocks.add(async (request) => {
    const url = new URL(request.url)
    const priceChain = browseNetworks.find(
      (network) => url.pathname === `/price/v1/${network}`,
    )
    if (request.method === 'GET' && priceChain !== undefined) {
      const prices = {
        [NativeAddress]: 3000,
        [EvmNative.fromChainId(priceChain).wrap().address]: 3000,
        [USDC[priceChain].address]: 1,
      }
      if (request.headers.get('accept')?.includes('application/octet-stream')) {
        const entries = Object.entries(prices)
        const buffer = Buffer.alloc(entries.length * 24)
        entries.forEach(([address, price], index) => {
          Buffer.from(address.slice(2), 'hex').copy(buffer, index * 24)
          buffer.writeFloatLE(price, index * 24 + 20)
        })
        return new Response(new Uint8Array(buffer), {
          headers: { 'content-type': 'application/octet-stream' },
        })
      }
      return Response.json(prices)
    }
    if (
      url.hostname === 'api.merkl.xyz' &&
      (url.pathname === '/v4/campaigns' ||
        /^\/v4\/users\/0x[a-fA-F0-9]{40}\/rewards$/.test(url.pathname))
    )
      return Response.json([])
    if (url.pathname !== '/api/graphql') return
    const { operationName, variables } = graphRequest.parse(
      await request.json(),
    )
    if (operationName === 'LaunchpadTokens')
      return Response.json({
        data: {
          launchpad: {
            tokens: {
              edges: [],
              pageInfo: { endCursor: null, hasNextPage: false },
              totalCount: 0,
            },
          },
        },
      })
    if (operationName === 'TrendingTokens')
      return Response.json({ data: { trendingTokens: [] } })
    if (operationName === 'V3PoolsByTokens')
      return Response.json({ data: { v3PoolsByTokens: [] } })
    if (operationName === 'TokenList') {
      const { tokens } = tokenFixture(variables.chainId)
      const search =
        typeof variables.search === 'string'
          ? variables.search.toLowerCase()
          : ''
      return Response.json({
        data: {
          tokenList: tokens
            .filter(
              (token) =>
                !search ||
                [token.address, token.symbol ?? '', token.name ?? ''].some(
                  (value) => value.toLowerCase().includes(search),
                ),
            )
            .map((token) => ({
              ...token.toJSON(),
              address: token.address,
              approved: true,
              approvalStatus: 'APPROVED',
            })),
        },
      })
    }
    if (operationName === 'TokenListBalances') {
      const { native, tokens, forkBalances } = tokenFixture(variables.chainId)
      const currencies = variables.includeNative ? [native, ...tokens] : tokens
      return Response.json({
        data: {
          tokenListBalances: await Promise.all(
            currencies.map(async (currency) => ({
              name: currency.name,
              symbol: currency.symbol,
              decimals: currency.decimals,
              address:
                currency.type === 'native' ? NativeAddress : currency.address,
              approved: true,
              approvalStatus: 'APPROVED',
              balance: (forkBalances
                ? await currencyBalance(fork.client, currency)
                : 0n
              ).toString(),
            })),
          ),
        },
      })
    }
  })
}
