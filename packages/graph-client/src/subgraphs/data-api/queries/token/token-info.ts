import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/evm'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TokenInfoQuery = graphql(
  `
  query TokenInfoQuery($chainId: SushiSwapChainId!, $address: Bytes!) {
    exploreTokenInfo(chainId: $chainId, address: $address) {
      description
      website
      twitter
      telegram
      discord
    }
  }
`,
)

export type GetTokenInfo = VariablesOf<typeof TokenInfoQuery>

export async function getTokenInfo(
  variables: GetTokenInfo,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    const result = await request(
      {
        url,
        document: TokenInfoQuery,
        variables: {
          ...variables,
          address: variables.address.toLowerCase(),
        },
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result.exploreTokenInfo) {
      return result.exploreTokenInfo
    }
  } catch (error) {
    console.error('getTokenInfo error', error)
  }
  return null
}

export type TokenInfo = Awaited<ReturnType<typeof getTokenInfo>>
