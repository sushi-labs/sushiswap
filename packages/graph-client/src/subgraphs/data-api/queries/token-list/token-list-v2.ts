import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { type ChainId, getIdFromChainIdAddress } from 'sushi'
// import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TokenListV2Query = graphql(
  `
		query TokenListV2(
			$chainIds: [TokenListV2ChainId!]!
			$first: Int = 50
			$skip: Int
			$search: String
			$customTokens: [MultiChainTokenInput!]
		) {
			tokenListV2(
				chainIds: $chainIds
				first: $first
				skip: $skip
				search: $search
				customTokens: $customTokens
			) {
				address
				approved
				chainId
				decimals
				name
				symbol
				priceUSD
			}
		}
	`,
)

export type GetTokenListV2 = VariablesOf<typeof TokenListV2Query>

export async function getTokenListV2(
  variables: GetTokenListV2,
  options?: RequestOptions,
) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`;
  // const url = `https://data-api-feature-balance-v2.data-gcp.sushi.com/graphql`
  const url = `https://data-api-154-merge.data-gcp.sushi.com/graphql`

  const result = await request(
    {
      url,
      document: TokenListV2Query,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.tokenListV2.map((token) => ({
      id: getIdFromChainIdAddress(token.chainId as ChainId, token.address),
      ...token,
    }))
  }

  throw new Error('No tokens found')
}

export type TokenListV2 = Awaited<ReturnType<typeof getTokenListV2>>
