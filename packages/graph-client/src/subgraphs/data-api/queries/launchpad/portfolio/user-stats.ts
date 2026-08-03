import type { ResultOf, VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../../data-api-host.js'
import { graphql } from '../../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../../request-headers.js'

export const LaunchpadUserStatsQuery = graphql(`
  query Launchpad($chainId: LaunchpadChainId!, $address: EvmAddress!) {
    launchpad {
      userStats(chainId: $chainId, address: $address) {
        totalHoldingsUsd
        totalPnlPercent
        totalPnlUsd
        totalTokensHeld
      }
    }
  }
`)

export type GetLaunchpadUserStats = VariablesOf<typeof LaunchpadUserStatsQuery>
export type LaunchpadUserStatsType = ResultOf<
  typeof LaunchpadUserStatsQuery
>['launchpad']['userStats']

export async function getLaunchpadUserStats(
  variables: GetLaunchpadUserStats,
  options?: RequestOptions,
): Promise<LaunchpadUserStatsType> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadUserStatsQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.userStats
}
