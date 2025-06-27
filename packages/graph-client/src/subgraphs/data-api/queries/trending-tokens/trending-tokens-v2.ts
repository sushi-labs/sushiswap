import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { getIdFromChainIdAddress } from 'sushi'

import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TrendingTokensV2Query = graphql(
  `
		query TrendingTokensV2($chainIds: [TrendingTokensChainId!]!) {
			trendingTokensV2(chainIds: $chainIds) {
				address
				symbol
				name
				decimals
				approved
				chainId
			}
		}
	`,
)

export type GetTrendingTokensV2 = VariablesOf<typeof TrendingTokensV2Query>

export async function getTrendingTokensV2(
  variables: GetTrendingTokensV2,
  options?: RequestOptions,
) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`;
  const url = `https://data-api-154-merge.data-gcp.sushi.com/graphql`

  const result = await request(
    {
      url,
      document: TrendingTokensV2Query,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.trendingTokensV2.map((token) => ({
      id: getIdFromChainIdAddress(token.chainId, token.address),
      ...token,
    }))
  }

  throw new Error('No trending tokens found')
}

export type TrendingTokensV2 = Awaited<ReturnType<typeof getTrendingTokensV2>>
export type TrendingTokenV2 = TrendingTokensV2[number]
