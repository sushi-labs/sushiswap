import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../../data-api-host.js'
import { graphql } from '../../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../../request-headers.js'

export const PerpsLeaderboardQuery = graphql(
  `
    query PerpsLeaderboard($timeframe: PerpsLeaderboardTimeframe!) {
      perps {
        leaderboard(timeframe: $timeframe) {
          updatedAt
          timeframe
          entries {
            volumeUsd
            seasonPoints
            seasonVolumeUsd
            points
            pnl
            address
          }
        }
      }
    }
  `,
)

export type GetPerpsLeaderboard = VariablesOf<typeof PerpsLeaderboardQuery>

export async function getPerpsLeaderboard(
  variables: GetPerpsLeaderboard,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: PerpsLeaderboardQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.perps.leaderboard
  }

  throw new Error('No perps leaderboard')
}

export type PerpsLeaderboard = Awaited<ReturnType<typeof getPerpsLeaderboard>>
export type PerpsLeaderboardTimeframe = PerpsLeaderboard['timeframe']
export type PerpsLeaderboardEntry = PerpsLeaderboard['entries'][number]
