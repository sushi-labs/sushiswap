import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'
import { LEADERBOARD_API_HOST } from '../../leadboard-host.js'
import { LEADERBOARD_REQUEST_HEADERS } from '../../request-headers.js'

export const AcceptReferralMutation = graphql(
  `
mutation AcceptReferral($referralCode: String!, $message: String!, $signature: String!, $userAddress: String!) {
  acceptReferral(referralCode: $referralCode, message: $message, signature: $signature, userAddress: $userAddress) {
    message
    success
  }
}
`,
)

export type AcceptReferral = VariablesOf<typeof AcceptReferralMutation>

export async function acceptReferral(
  variables: AcceptReferral,
  options?: RequestOptions,
) {
  const url = `${LEADERBOARD_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: AcceptReferralMutation,
      variables,
      requestHeaders: LEADERBOARD_REQUEST_HEADERS,
    },
    options,
  )
  if (result) {
    return result.acceptReferral
  }

  throw new Error('No data returned from Leaderboard API for user stats')
}

export type AcceptReferralResponse = Awaited<ReturnType<typeof acceptReferral>>
