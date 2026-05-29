import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../../data-api-host.js'
import { graphql } from '../../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../../request-headers.js'

export const PerpsLeaderboardUserQuery = graphql(
  `
   query LeaderboardUser($address: EvmAddress!, $timeframe: PerpsLeaderboardTimeframe!) {
    perps {
      leaderboardUser(address: $address, timeframe: $timeframe) {
        volumeUsd
        seasonPoints
        seasonVolumeUsd
        rank
        points
        pnl
        address
        timeframe
      }
    }
  }
  `,
)

export type GetPerpsLeaderboardUser = VariablesOf<
  typeof PerpsLeaderboardUserQuery
>

export async function getPerpsLeaderboardUser(
  variables: GetPerpsLeaderboardUser,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: PerpsLeaderboardUserQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.perps.leaderboardUser
  }

  throw new Error('No perps leaderboard')
}

export type PerpsLeaderboardUser = Awaited<
  ReturnType<typeof getPerpsLeaderboardUser>
>
