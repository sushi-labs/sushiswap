import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TokenPriceChartQuery = graphql(
  `
  query TokenPriceChartQuery($chainId: SushiSwapChainId!, $address: Bytes!, $duration: ExploreTokenChartDuration!) {
    exploreTokenChart(
        chainId: $chainId
        address: $address
        duration: $duration
    ) {
        close
        low
        high
        open
        timestamp
    }
  }
`,
)

export type GetTokenPriceChart = VariablesOf<typeof TokenPriceChartQuery>

export async function getTokenPriceChart(
  variables: GetTokenPriceChart,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`
  try {
    const result = await request(
      {
        url,
        document: TokenPriceChartQuery,
        variables,
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result) {
      return result.exploreTokenChart
    }
  } catch (error) {
    console.error('getTokenPriceChart error', error)
  }
  return null
}

export type TokenPriceChart = Awaited<ReturnType<typeof getTokenPriceChart>>
