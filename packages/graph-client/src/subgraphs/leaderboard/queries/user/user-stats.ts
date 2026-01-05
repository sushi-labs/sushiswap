import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'
import { LEADERBOARD_API_HOST } from '../../leadboard-host.js'
import { LEADERBOARD_REQUEST_HEADERS } from '../../request-headers.js'

export const UserStatsQuery = graphql(
  `
 query UserStats($address: String!, $season: Int) {
  userStats(address: $address, season: $season) {
    address
    points
    rank
    volumeUsd
    season {
      name
      number
      startTime
      isActive
      endTime
    }
  }
}
`,
)

export type GetUserStats = VariablesOf<typeof UserStatsQuery>

export async function getUserStats(
  variables: GetUserStats,
  options?: RequestOptions,
) {
  const url = `${LEADERBOARD_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: UserStatsQuery,
      variables,
      requestHeaders: LEADERBOARD_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return result.userStats
  }

  throw new Error('No data returned from Leaderboard API for user stats')
}

export type UserStats = Awaited<ReturnType<typeof getUserStats>>
