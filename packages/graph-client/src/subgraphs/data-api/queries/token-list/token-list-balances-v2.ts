import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'

import { type ChainId, getIdFromChainIdAddress } from 'sushi'
// import { SUSHI_DATA_API_HOST } from "sushi/config/subgraph";
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const TokenListBalancesV2Query = graphql(
  `
		query TokenListBalancesV2(
			$chainIds: [TokenListV2ChainId!]!
			$account: Bytes!
			$includeNative: Boolean
			$customTokens: [MultiChainTokenInput!]!
		) {
			tokenListBalancesV2(
				chainIds: $chainIds
				account: $account
				includeNative: $includeNative
				customTokens: $customTokens
			) {
				balances {
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
		}
	`,
)

export type GetTokenListBalancesV2 = VariablesOf<
  typeof TokenListBalancesV2Query
>

export async function getTokenListBalancesV2(
  variables: GetTokenListBalancesV2,
  options?: RequestOptions,
) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`;
  const url = `https://data-api-feature-balance-v2.data-gcp.sushi.com/graphql`

  const result = await request(
    {
      url,
      document: TokenListBalancesV2Query,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.tokenListBalancesV2?.balances.map((token) => ({
      id: getIdFromChainIdAddress(token.chainId as ChainId, token.address),
      ...token,
    }))
  }

  throw new Error('No tokens found')
}

export type TokenListBalancesV2 = Awaited<
  ReturnType<typeof getTokenListBalancesV2>
>
export type TokenListBalanceV2 = TokenListBalancesV2[number]
