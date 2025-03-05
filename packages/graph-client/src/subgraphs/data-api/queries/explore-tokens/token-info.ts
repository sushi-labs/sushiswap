import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const ExploreTokenInfoQuery = graphql(
  `
  query ExploreTokenInfoQuery($chainId: SushiSwapChainId!, $chainIdInt: Int!, $address: Bytes!) {
    exploreTokenInfo(chainId: $chainId, address: $address) {
      description
      website
      twitter
      telegram
      discord
    }
    tokenAnalysis(chainId: $chainIdInt, address: $address) {
      token {
        id
        chainId
        address
        name
        symbol
        decimals
      }
    }
  }
`,
)

export type GetExploreTokenInfo = VariablesOf<typeof ExploreTokenInfoQuery>

export async function getTokenInfo(
  variables: GetExploreTokenInfo,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  const result = await request(
    {
      url,
      document: ExploreTokenInfoQuery,
      variables: {
        ...variables,
        address: variables.address.toLowerCase(),
      },
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result.exploreTokenInfo && result.tokenAnalysis.token) {
    return {
      info: result.exploreTokenInfo,
      token: result.tokenAnalysis.token,
    }
  }

  throw new Error('No token info found')
}

export type ExploreTokenInfo = Awaited<ReturnType<typeof getTokenInfo>>
