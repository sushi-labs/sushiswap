import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
// import { SUSHI_DATA_API_HOST } from "sushi/config/subgraph";
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const RecentSwapsQuery = graphql(
  `
		query RecentSwaps($account: Bytes!, $chainIds: [TokenListV2ChainId!]!) {
			recentSwaps(account: $account, chainIds: $chainIds) {
				amountIn
				amountInUSD
				amountOut
				amountOutUSD
				deltaRealizedPnl
				protocol
				realizedPnl
				time
				tokenIn {
					address
					approved
					chainId
					decimals
					name
					symbol
				}
				tokenOut {
					address
					approved
					chainId
					decimals
					name
					symbol
				}
				totalPnl
				unrealizedPnl
			}
		}
	`,
)

export type GetRecentSwaps = VariablesOf<typeof RecentSwapsQuery>

export async function getRecentSwaps(
  variables: GetRecentSwaps,
  options?: RequestOptions,
) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`;
  const url = `https://data-api-feature-balance-v2.data-gcp.sushi.com/graphql`
  try {
    const result = await request(
      {
        url,
        document: RecentSwapsQuery,
        variables: {
          ...variables,
        },
        requestHeaders: SUSHI_REQUEST_HEADERS,
      },
      options,
    )
    if (result.recentSwaps) {
      return result.recentSwaps
    }
  } catch (error) {
    console.error('getRecentSwaps error', error)
  }
  return null
}

export type RecentSwaps = Awaited<ReturnType<typeof getRecentSwaps>>
export type RecentSwap = NonNullable<RecentSwaps>[number]
