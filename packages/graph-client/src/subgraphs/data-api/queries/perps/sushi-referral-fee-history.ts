import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const PerpsSushiReferralFeeHistoryQuery = graphql(
  `
    query PerpsSushiReferralFeeHistory($address: EvmAddress!, $from: String, $to: String) {
      perps {
        referralFeeHistory(address: $address, from: $from, to: $to) {
          date
          amount
        }
      }
    }
  `,
)

export type GetPerpsSushiReferralFeeHistory = VariablesOf<
  typeof PerpsSushiReferralFeeHistoryQuery
>

export async function getPerpsSushiReferralFeeHistory(
  variables: GetPerpsSushiReferralFeeHistory,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: PerpsSushiReferralFeeHistoryQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.perps.referralFeeHistory
  }

  throw new Error('No perps sushi referral fee history')
}

export type PerpsSushiReferralFeeHistory = Awaited<
  ReturnType<typeof getPerpsSushiReferralFeeHistory>
>
export type PerpsSushiReferralFeePoint = PerpsSushiReferralFeeHistory[number]
