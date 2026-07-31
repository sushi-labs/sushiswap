import type { VariablesOf } from 'gql.tada'
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

export async function getLaunchpadUserStats(
  variables: GetLaunchpadUserStats,
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: LaunchpadUserStatsQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return result.launchpad.userStats
  }
  throw new Error('No launchpad user stats data')
}

export type LaunchpadUserStatsType = Awaited<
  ReturnType<typeof getLaunchpadUserStats>
>
