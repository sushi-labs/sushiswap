import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { KADENA_INDEXER_GRAPHQL_URL } from '../../constants.js'
import { graphql } from '../../graphql.js'
import { KADENA_INDEXER_REQUEST_HEADERS } from '../../request-headers.js'

export const PoolTransactionsQuery = graphql(
  `
		query PoolTransactions($pairId: String!, $type: PoolTransactionType, $first: Int!, $after: String) {
			poolTransactions(pairId: $pairId, type: $type, first: $first, after: $after) {
				totalCount
				pageInfo {
					endCursor
					hasNextPage
				}
				edges {
					cursor
					node {
						amount0In
						amount0Out
						amount1In
						amount1Out
						amountUsd
						id
						maker
						requestkey
						timestamp
						transactionId
						transactionType
					}
				}
			}
		}
	`,
)

export type GetPoolTransactions = VariablesOf<typeof PoolTransactionsQuery>
export type PoolTransactionType = NonNullable<GetPoolTransactions['type']>

export type GetPoolTransactionsResponse = Awaited<
  ReturnType<typeof getPoolTransactions>
>

export async function getPoolTransactions(
  variables: GetPoolTransactions,
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: KADENA_INDEXER_GRAPHQL_URL,
      document: PoolTransactionsQuery,
      variables,
      requestHeaders: KADENA_INDEXER_REQUEST_HEADERS,
    },
    options,
  )

  if (!result.poolTransactions) {
    throw new Error('Failed to getPoolTransactions')
  }

  return result.poolTransactions
}
