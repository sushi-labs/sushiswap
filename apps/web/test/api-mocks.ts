import { NativeAddress, SUSHI_DATA_API_HOST } from 'src/lib/constants'
import { EvmNative, SUSHI, USDC, USDT, WBTC } from 'sushi/evm'
import * as z from 'zod'
import { chainId } from './constants'
import type { Fork } from './fixtures'
import { currencyBalance } from './fork'
import type { NetworkMocks } from './intercept-anvil'
import { installWalletConnectMocks } from './walletconnect-mocks'

export const graphRequest = z.object({
  operationName: z.string(),
  variables: z.record(z.string(), z.unknown()).default({}),
})

export function installApiMocks(mocks: NetworkMocks, fork: Fork): void {
  installWalletConnectMocks(mocks)
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
      request.method === 'POST' &&
      url.hostname === 'loki.analytics.sushi.com' &&
      url.pathname === '/loki/api/v1/push'
    )
      return new Response(null, { status: 204 })
    // The Edge Config SDK reads the complete config in development, while
    // production requests the individual /item/swap endpoint.
    if (
      request.method === 'GET' &&
      url.hostname === 'edge-config.vercel.com' &&
      /^\/ecfg_[a-z0-9]+\/items$/.test(url.pathname)
    )
      return Response.json({ swap: { maintenance: false } })
    if (
      request.method === 'GET' &&
      url.origin === new URL(SUSHI_DATA_API_HOST).origin &&
      url.pathname === `/price/v1/${chainId}` &&
      request.headers.get('accept') === 'application/octet-stream'
    )
      return new Response(new Uint8Array(), {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Last-Updated': '0',
        },
      })
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
