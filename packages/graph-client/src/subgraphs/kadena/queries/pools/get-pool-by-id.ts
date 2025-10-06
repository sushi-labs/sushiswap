import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { KADENA_INDEXER_GRAPHQL_URL } from '../../constants.js'
import { graphql } from '../../graphql.js'
import { KADENA_INDEXER_REQUEST_HEADERS } from '../../request-headers.js'

export const GetPoolQuery = graphql(
  `
		query GetPoolDetails($poolId: ID!, $timeFrame: TimeFrame = DAY, $first: Int = 1) {
			pool(id: $poolId) {
				id
				address
				token0 {
					id
					name
					chainId
					address
				}
				token1 {
					id
					name
					chainId
					address
				}
				reserve0
				reserve1
				totalSupply
				tvlUsd
				tvlChange24h
				volume24hUsd
				volumeChange24h
				volume7dUsd
				fees24hUsd
				feesChange24h
				transactionCount24h
				transactionCountChange24h
				apr24h
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
				transactions(first: $first) {
					edges {
						node {
							id
							maker
							amount0In
							amount1In
							amount0Out
							amount1Out
							amountUsd
							timestamp
							transactionType
							requestkey
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
					totalCount
				}
			}
		}
	`,
)

export type GetPool = VariablesOf<typeof GetPoolQuery>
export type GetPoolTimeframe = VariablesOf<typeof GetPoolQuery>['timeFrame']

export type GetPoolResponse = Awaited<ReturnType<typeof getPool>>
export type GetPoolTransaction =
  GetPoolResponse['transactions']['edges'][number]['node']

export async function getPool(variables: GetPool, options?: RequestOptions) {
  const result = await request(
    {
      url: KADENA_INDEXER_GRAPHQL_URL,
      document: GetPoolQuery,
      variables,
      requestHeaders: KADENA_INDEXER_REQUEST_HEADERS,
    },
    options,
  )

  if (!result.pool) {
    throw new Error('Failed to getPool')
  }

  return result.pool
}
