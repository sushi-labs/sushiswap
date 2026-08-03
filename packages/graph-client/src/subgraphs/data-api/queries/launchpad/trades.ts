import type { ResultOf, VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const LaunchpadTradesQuery = graphql(`
  query LaunchpadTrades($input: LaunchpadTradesInput!) {
    launchpad {
      trades(input: $input) {
        streamCursor
        totalCount
        edges {
          cursor
          node {
            id
            chainId
            tokenAddress
            poolAddress
            feeTier
            isLaunchPool
            transactionHash
            logIndex
            blockNumber
            timestamp
            trader
            direction
            tokenAmount
            quoteToken {
              address
              symbol
              name
              decimals
            }
            quoteAmount
            priceUsd
            amountUsd
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`)

export type GetLaunchpadTrades = VariablesOf<typeof LaunchpadTradesQuery>
export type LaunchpadTradesInput = GetLaunchpadTrades['input']
export type LaunchpadTradeConnection = ResultOf<
  typeof LaunchpadTradesQuery
>['launchpad']['trades']
export type LaunchpadTrade = LaunchpadTradeConnection['edges'][number]['node']
export type LaunchpadTradeDirection = LaunchpadTrade['direction']

export async function getLaunchpadTrades(
  variables: GetLaunchpadTrades,
  options?: RequestOptions,
): Promise<LaunchpadTradeConnection> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadTradesQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.trades
}
