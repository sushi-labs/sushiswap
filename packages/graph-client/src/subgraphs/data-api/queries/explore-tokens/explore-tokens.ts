import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const ExploreTokensQuery = graphql(
  `
  query ExploreTokensQuery($chainId: SushiSwapChainId!) {
    exploreTokens(chainId: $chainId) {
      address
      chainId
      symbol
      name
      decimals
      logoUrl
      price
      priceChangePercentage1d
      marketCapUSD
      sparkline7d
    }
  }
`,
)

export type GetExploreTokens = VariablesOf<typeof ExploreTokensQuery>

export async function getExploreTokens(
  variables: GetExploreTokens,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: ExploreTokensQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.exploreTokens
  }

  throw new Error('No tokens found')
}

export type ExploreTokens = Awaited<ReturnType<typeof getExploreTokens>>
export type ExploreToken = ExploreTokens[number]
