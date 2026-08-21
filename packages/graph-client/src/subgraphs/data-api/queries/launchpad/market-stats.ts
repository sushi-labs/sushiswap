import type { ResultOf, VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const LaunchpadMarketStatsWindowFragment = graphql(`
  fragment LaunchpadMarketStatsWindowFragment on LaunchpadMarketStatsWindow @_unmask {
    asOf
    buyVolumeUsd
    sellVolumeUsd
    totalVolumeUsd
    buyCount
    sellCount
    totalTradeCount
    priceBaselineUsd
    priceChangePercent
  }
`)

export const LaunchpadMarketStatsQuery = graphql(
  `
    query LaunchpadMarketStats($input: LaunchpadMarketStatsInput!) {
      launchpad {
        marketStats(input: $input) {
          priceUsd
          asOf
          streamCursor
          m5 {
            ...LaunchpadMarketStatsWindowFragment
          }
          h1 {
            ...LaunchpadMarketStatsWindowFragment
          }
          h6 {
            ...LaunchpadMarketStatsWindowFragment
          }
          h24 {
            ...LaunchpadMarketStatsWindowFragment
          }
        }
      }
    }
  `,
  [LaunchpadMarketStatsWindowFragment],
)

export type GetLaunchpadMarketStats = VariablesOf<
  typeof LaunchpadMarketStatsQuery
>
export type LaunchpadMarketStatsInput = GetLaunchpadMarketStats['input']
export type LaunchpadMarketStats = ResultOf<
  typeof LaunchpadMarketStatsQuery
>['launchpad']['marketStats']
export type LaunchpadMarketStatsWindow = LaunchpadMarketStats['m5']

export async function getLaunchpadMarketStats(
  variables: GetLaunchpadMarketStats,
  options?: RequestOptions,
): Promise<LaunchpadMarketStats> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadMarketStatsQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.marketStats
}
