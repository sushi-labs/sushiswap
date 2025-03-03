import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const ExploreTokenPriceChartQuery = graphql(
  `
  query ExploreTokenPriceChartQuery($chainId: SushiSwapChainId!, $address: Bytes!, $duration: ExploreTokenChartDuration!) {
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

export type GetExploreTokenPriceChart = VariablesOf<typeof ExploreTokenPriceChartQuery>

export async function getTokenPriceChart(
  variables: GetExploreTokenPriceChart,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: ExploreTokenPriceChartQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.exploreTokenChart
  }

  throw new Error('No token chart found')
}

export type ExploreTokenPriceChart = Awaited<ReturnType<typeof getTokenPriceChart>>
