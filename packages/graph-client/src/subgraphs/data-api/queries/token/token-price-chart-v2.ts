import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TokenPriceChartQueryV2 = graphql(
  `
		query TokenPriceChartQueryV2(
			$chainId: SushiSwapChainId!
			$address: Bytes!
			$interval: ExploreTokenChartInterval!
			$from: Int!
			$to: Int!
		) {
			exploreTokenChartV2(chainId: $chainId, address: $address, interval: $interval, from: $from, to: $to) {
				close
				low
				high
				open
				timestamp
			}
		}
	`,
)

export type GetTokenPriceChartV2 = VariablesOf<typeof TokenPriceChartQueryV2>

export async function getTokenPriceChartV2(
  variables: GetTokenPriceChartV2,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    const result = await request(
      {
        url,
        document: TokenPriceChartQueryV2,
        variables: {
          ...variables,
          address: variables.address.toLowerCase(),
        },
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result.exploreTokenChartV2) {
      return result.exploreTokenChartV2
    }
  } catch (error) {
    console.error('getTokenPriceChartV2 error', error)
  }
  return []
}

export type TokenPriceChartV2 = Awaited<ReturnType<typeof getTokenPriceChartV2>>
