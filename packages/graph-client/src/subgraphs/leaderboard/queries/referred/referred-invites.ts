import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'
import { LEADERBOARD_API_HOST } from '../../leadboard-host.js'
import { LEADERBOARD_REQUEST_HEADERS } from '../../request-headers.js'

export const ReferralInvitesQuery = graphql(
  `
query ReferralInvites($referrerAddress: String!, $season: Int, $page: Int, $pageSize: Int) {
  referralInvites(referrerAddress: $referrerAddress, season: $season, page: $page, pageSize: $pageSize) {
    pageInfo {
      currentPage
      hasNextPage
      hasPreviousPage
      pageSize
      totalCount
      totalPages
    }
    season {
      startTime
      number
      name
      isActive
      endTime
    }
    referredUsers {
      volumeUsd
      referralPoints
      address
    }
  }
}
`,
)

export type GetReferralInvites = VariablesOf<typeof ReferralInvitesQuery>

export async function getReferralInvites(
  variables: GetReferralInvites,
  options?: RequestOptions,
) {
  const url = `${LEADERBOARD_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: ReferralInvitesQuery,
      variables,
      requestHeaders: LEADERBOARD_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return result.referralInvites
  }

  throw new Error('No data returned from Leaderboard API for referral invites')
}

export type ReferralInvites = Awaited<ReturnType<typeof getReferralInvites>>
export type ReferredUser = ReferralInvites['referredUsers'][number]
