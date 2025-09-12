import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { KADENA_INDEXER_GRAPHQL_URL } from '../../constants.js'
import { graphql } from '../../graphql.js'
import { KADENA_INDEXER_REQUEST_HEADERS } from '../../request-headers.js'

export const GetAllPoolsQuery = graphql(
  `
		query GetPools($first: Int, $orderBy: PoolOrderBy = TVL_USD_DESC, $after: String) {
			pools(first: $first, orderBy: $orderBy, after: $after) {
				edges {
					node {
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
						tvlUsd
						volume24hUsd
						volume7dUsd
						transactionCount24h
						apr24h
						fees24hUsd
					}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
				totalCount
			}
		}
	`,
)

export type GetPools = VariablesOf<typeof GetAllPoolsQuery>
export type GetPoolsOrderBy = GetPools['orderBy']

export type GetPoolsResponse = Awaited<ReturnType<typeof getAllPools>>
export type KadenaPool = GetPoolsResponse['edges'][number]['node']

export async function getAllPools(
  variables: GetPools,
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: KADENA_INDEXER_GRAPHQL_URL,
      document: GetAllPoolsQuery,
      variables,
      requestHeaders: KADENA_INDEXER_REQUEST_HEADERS,
    },
    options,
  )

  if (!result.pools) {
    throw new Error('Failed to getAllPools')
  }

  return result.pools
}
