import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const ExploreTokenChartQuery = graphql(
  `
  query ExploreTokenChartQuery($chainId: SushiSwapChainId!, $address: String!, $duration: ExploreTokenChartDuration!) {
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

export type GetExploreTokenChart = VariablesOf<typeof ExploreTokenChartQuery>

export async function getTokenChart(
  variables: GetExploreTokenChart,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: ExploreTokenChartQuery,
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

export type ExploreTokenChart = Awaited<ReturnType<typeof getTokenChart>>
