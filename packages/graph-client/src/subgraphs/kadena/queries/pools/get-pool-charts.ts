import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { KADENA_INDEXER_GRAPHQL_URL } from '../../constants.js'
import { graphql } from '../../graphql.js'
import { KADENA_INDEXER_REQUEST_HEADERS } from '../../request-headers.js'

export const GetPoolChartQuery = graphql(
  `
		query GetPoolChart($poolId: ID!, $timeFrame: TimeFrame = DAY) {
			pool(id: $poolId) {
				charts(timeFrame: $timeFrame) {
					volume {
						timestamp
						value
					}
					tvl {
						timestamp
						value
					}
					fees {
						timestamp
						value
					}
				}
			}
		}
	`,
)

export type GetPoolChart = VariablesOf<typeof GetPoolChartQuery>
export type PoolTimeFrame = GetPoolChart['timeFrame']

export type GetPoolChartResponse = Awaited<ReturnType<typeof getPoolCharts>>

export async function getPoolCharts(
  variables: GetPoolChart,
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: KADENA_INDEXER_GRAPHQL_URL,
      document: GetPoolChartQuery,
      variables,
      requestHeaders: KADENA_INDEXER_REQUEST_HEADERS,
    },
    options,
  )

  if (!result.pool) {
    throw new Error('Failed to getPoolCharts')
  }

  return result.pool
}
