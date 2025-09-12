import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { KADENA_INDEXER_GRAPHQL_URL } from '../../constants.js'
import { graphql } from '../../graphql.js'
import { KADENA_INDEXER_REQUEST_HEADERS } from '../../request-headers.js'

export const GetWalletPositionsQuery = graphql(
  `
		query GetWalletPositions($walletAddress: String!, $first: Int = 10, $after: String) {
			liquidityPositions(
				walletAddress: $walletAddress
				orderBy: VALUE_USD_DESC
				first: $first
				after: $after
			) {
				edges {
					node {
						id
						pairId
						pair {
							address
							id
							reserve0
							reserve1
							token0 {
								address
								chainId
								id
								name
							}
							token1 {
								address
								chainId
								id
								name
							}
							tvlUsd
							totalSupply
						}
						liquidity
						valueUsd
						apr24h
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

export type GetWalletPositions = VariablesOf<typeof GetWalletPositionsQuery>

export type GetWalletPositionsResponse = Awaited<
  ReturnType<typeof getWalletPositions>
>
export type WalletPosition = GetWalletPositionsResponse['edges'][number]['node']

export async function getWalletPositions(
  variables: GetWalletPositions,
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: KADENA_INDEXER_GRAPHQL_URL,
      document: GetWalletPositionsQuery,
      variables,
      requestHeaders: KADENA_INDEXER_REQUEST_HEADERS,
    },
    options,
  )

  if (!result.liquidityPositions) {
    throw new Error('Failed to getWalletPositions')
  }

  return result.liquidityPositions
}
