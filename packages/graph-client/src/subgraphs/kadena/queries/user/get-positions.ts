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

//types not picking up that endCursor can be null sometimes
export type GetWalletPositionsResponse = Omit<
  Awaited<ReturnType<typeof getWalletPositions>>,
  'pageInfo'
> & {
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }
}

//types not picking up that valueUsd can be null sometimes
export type WalletPosition = Omit<
  GetWalletPositionsResponse['edges'][number]['node'],
  'valueUsd'
> & {
  valueUsd: number | null
}

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
