import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'

export const ExplorePoolStatisticsQuery = graphql(`
  query ExplorePoolStatistics {
    explorePoolStatistics {
      v2 {
        liquidityUSD
        liquidityUSDChange1w
        volumeUSD1w
        volumeUSDChange1w
      }
      v3 {
        liquidityUSD
        liquidityUSDChange1w
        volumeUSD1w
        volumeUSDChange1w
      }
      all {
        liquidityUSD
        liquidityUSDChange1w
        volumeUSD1w
        volumeUSDChange1w
      }
    }
  }
`)

export type GetExplorePoolStatistics = VariablesOf<
  typeof ExplorePoolStatisticsQuery
>

export async function getExplorePoolStatistics(options?: RequestOptions) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`
  const url = 'https://data-api-feat-sushi2.data-gcp.sushi.com/graphql'

  const result = await request(
    { url, document: ExplorePoolStatisticsQuery },
    options,
  )

  if (result) {
    return result.explorePoolStatistics
  }

  throw new Error('Failed to fetch explore pool statistics')
}

export type ExplorePoolStatistics = Awaited<
  ReturnType<typeof getExplorePoolStatistics>
>
