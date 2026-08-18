import type { ResultOf, VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const LaunchpadStatsQuery = graphql(`
  query Launchpad(
    $chainId: LaunchpadChainId!
    $providers: [LaunchpadProvider!]! = [SUSHI_V1]
  ) {
    launchpad {
      stats(chainId: $chainId, providers: $providers) {
        totalLiquidityUsd
        totalTokensLaunched
        totalVolumeUsd24h
      }
    }
  }
`)

export type GetLaunchpadStats = VariablesOf<typeof LaunchpadStatsQuery>
export type LaunchpadStatsType = ResultOf<
  typeof LaunchpadStatsQuery
>['launchpad']['stats']

export async function getLaunchpadStats(
  variables: GetLaunchpadStats,
  options?: RequestOptions,
): Promise<LaunchpadStatsType> {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadStatsQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  return result.launchpad.stats
}
