import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const ExploreTokenInfoQuery = graphql(
  `
  query ExploreTokenInfoQuery($chainId: SushiSwapChainId!, $address: String!) {
    exploreTokenInfo(chainId: $chainId, address: $address) {
      categories
      description
      website
      twitter
      telegram
      discord
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
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.exploreTokenInfo
  }

  throw new Error('No token info found')
}

export type ExploreTokenInfo = Awaited<ReturnType<typeof getTokenInfo>>
