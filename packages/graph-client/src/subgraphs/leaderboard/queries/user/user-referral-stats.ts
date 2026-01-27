import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'
import { LEADERBOARD_API_HOST } from '../../leadboard-host.js'
import { LEADERBOARD_REQUEST_HEADERS } from '../../request-headers.js'

export const UserReferralStatsQuery = graphql(
  `
query UserReferralStatsQuery($address: String!, $seasons: [Int!]) {
  userReferralStats(address: $address, seasons: $seasons) {
    address
    rank
    season {
      startTime
      number
      name
      isActive
      endTime
    }
    totalReferralPoints
    totalReferralVolumeUsd
  }
}


`,
)

export type GetUserReferralStats = VariablesOf<typeof UserReferralStatsQuery>

export async function getUserReferralStats(
  variables: GetUserReferralStats,
  options?: RequestOptions,
) {
  const url = `${LEADERBOARD_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: UserReferralStatsQuery,
      variables,
      requestHeaders: LEADERBOARD_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return result.userReferralStats
  }

  throw new Error('No data returned from Leaderboard API for user stats')
}

export type UserReferralStats = Awaited<ReturnType<typeof getUserReferralStats>>
