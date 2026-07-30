import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const LaunchpadStatsQuery = graphql(`
  query Launchpad($chainId: LaunchpadChainId!) {
    launchpad {
      stats(chainId: $chainId) {
        totalLiquidityUsd
        totalTokensLaunched
        totalVolumeUsd24h
      }
    }
  }
`)

export type GetLaunchpadStats = VariablesOf<typeof LaunchpadStatsQuery>

export async function getLaunchpadStats(
  variables: GetLaunchpadStats,
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadStatsQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return result.launchpad.stats
  }
  throw new Error('No launchpad stats data')
}

export type LaunchpadStatsType = Awaited<ReturnType<typeof getLaunchpadStats>>
