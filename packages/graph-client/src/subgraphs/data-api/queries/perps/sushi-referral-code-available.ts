import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const ReferralCodeAvailableQuery = graphql(
  `
   query ReferralCodeAvailable($code: String!) {
      perps {
        isReferralCodeAvailable(code: $code)
      }
    }
  `,
)

export type GetReferralCodeAvailable = VariablesOf<
  typeof ReferralCodeAvailableQuery
>

export async function getReferralCodeAvailable(
  variables: GetReferralCodeAvailable,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: ReferralCodeAvailableQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.perps.isReferralCodeAvailable
  }

  throw new Error('No referral code availability data')
}

export type ReferralCodeAvailableType = Awaited<
  ReturnType<typeof getReferralCodeAvailable>
>
