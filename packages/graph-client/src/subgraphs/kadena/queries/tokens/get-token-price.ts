import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { KADENA_INDEXER_GRAPHQL_URL } from '../../constants.js'
import { graphql } from '../../graphql.js'
import { KADENA_INDEXER_REQUEST_HEADERS } from '../../request-headers.js'

export const GetTokenPriceQuery = graphql(
  `
		query GetTokenPrice($tokenAddress: String!) {
			tokenPrice(tokenAddress: $tokenAddress) {
				id
				priceInKda
				priceInUsd
				protocolAddress
				token {
					address
					id
					chainId
					name
				}
			}
		}
	`,
)

export type GetTokenPrice = VariablesOf<typeof GetTokenPriceQuery>

export type GetTokenPriceResponse = Awaited<ReturnType<typeof getTokenPrice>>

export async function getTokenPrice(
  variables: GetTokenPrice,
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: KADENA_INDEXER_GRAPHQL_URL,
      document: GetTokenPriceQuery,
      variables,
      requestHeaders: KADENA_INDEXER_REQUEST_HEADERS,
    },
    options,
  )

  if (!result.tokenPrice) {
    throw new Error('Failed to getTokenPrice')
  }

  return result.tokenPrice
}
