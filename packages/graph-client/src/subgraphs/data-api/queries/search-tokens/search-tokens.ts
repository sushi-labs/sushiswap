import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const SearchTokensQuery = graphql(`
	query SearchTokens(
		$account: Bytes!
		$chainIds: [TokenListV2ChainId!]!
		$first: Int = 50
		$skip: Int
		$search: String
		$tokens: [MultiChainTokenInput!]
	) {
		searchTokens(
			account: $account
			chainIds: $chainIds
			first: $first
			skip: $skip
			search: $search
			tokens: $tokens
		) {
			address
			approved
			balance
			balanceUSD
			chainId
			decimals
			name
			priceChange1d
			priceUSD
			symbol
			bridgeInfo {
				address
				chainId
				decimals
			}
		}
	}
`)

export type GetSearchTokens = VariablesOf<typeof SearchTokensQuery>

export async function getSearchTokens(
  variables: GetSearchTokens,
  options?: RequestOptions,
) {
  const url = `https://data-api-feat-sushi2.data-gcp.sushi.com/graphql`

  try {
    const result = await request(
      {
        url,
        document: SearchTokensQuery,
        variables: { ...variables },
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )

    if (result.searchTokens) return result.searchTokens
  } catch (error) {
    console.error('getSearchTokens error', error)
  }
  return null
}

export type SearchTokens = Awaited<ReturnType<typeof getSearchTokens>>
export type SearchToken = NonNullable<SearchTokens>[number]
