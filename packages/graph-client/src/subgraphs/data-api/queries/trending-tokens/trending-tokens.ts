import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { getIdFromChainIdAddress, type ChainId } from 'sushi'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'
import type { ChainIdVariable } from 'src/lib/types/chainId.js'

export const TrendingTokensQuery = graphql(
  `
  query TrendingTokens($chainId: TrendingTokensChainId!) {
    trendingTokens(chainId: $chainId) {
      address
      symbol
      name
      decimals
      approved
    }
  }
`,
)

export type GetTrendingTokens = VariablesOf<typeof TrendingTokensQuery> &
  ChainIdVariable<ChainId>

export async function getTrendingTokens(
  variables: GetTrendingTokens,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: TrendingTokensQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.trendingTokens.map((token) => ({
      id: getIdFromChainIdAddress(variables.chainId, token.address),
      chainId: variables.chainId,
      ...token,
    }))
  }

  throw new Error('No trending tokens found')
}

export type TrendingTokens = Awaited<ReturnType<typeof getTrendingTokens>>
