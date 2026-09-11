import { NativeAddress } from 'src/lib/constants'
import { EvmNative, SUSHI, USDC, USDT, WBTC } from 'sushi/evm'
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
  mocks.add(async (request) => {
    const url = new URL(request.url)
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
              balance: (
                await currencyBalance(fork.client, currency)
              ).toString(),
            })),
          ),
        },
      })
    }
  })
}
