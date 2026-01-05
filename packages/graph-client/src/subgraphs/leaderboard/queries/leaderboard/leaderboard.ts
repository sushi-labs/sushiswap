import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'
import { LEADERBOARD_API_HOST } from '../../leadboard-host.js'
import { LEADERBOARD_REQUEST_HEADERS } from '../../request-headers.js'

export const LeaderboardQuery = graphql(
  `
query LeaderboardQuery($pageSize: Int = 25, $page: Int = 1, $season: Int) {
  leaderboard(pageSize: $pageSize, page: $page, season: $season) {
    season {
      startTime
      number
      name
      isActive
      endTime
    }
    pageInfo {
      totalPages
      totalCount
      pageSize
      hasPreviousPage
      hasNextPage
      currentPage
    }
    entries {
      volumeUsd
      rank
      points
      address
    }
  }
}

`,
)

export type GetLeaderboard = VariablesOf<typeof LeaderboardQuery>

export async function getLeaderboard(
  variables: GetLeaderboard,
  options?: RequestOptions,
) {
  const url = `${LEADERBOARD_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: LeaderboardQuery,
      variables,
      requestHeaders: LEADERBOARD_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return result.leaderboard
  }

  throw new Error('No data returned from Leaderboard API for leaderboard')
}

export type Leaderboard = Awaited<ReturnType<typeof getLeaderboard>>
export type LeaderboardEntry = Leaderboard['entries'][number]
