import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const RedeemPerpsSushiReferralCodeMutation = graphql(
  `
    mutation RedeemPerpsSushiReferralCode($address: EvmAddress!, $code: String!, $expiresAt: String!, $signature: String!) {
      perps {
        redeemReferralCode(address: $address, code: $code, expiresAt: $expiresAt, signature: $signature) {
          id
          refereeAddress
          referrerAddress
          referralCode
          linkedAt
        }
      }
    }
  `,
)

export type RedeemPerpsSushiReferralCode = VariablesOf<
  typeof RedeemPerpsSushiReferralCodeMutation
>

export async function redeemPerpsSushiReferralCode(
  variables: RedeemPerpsSushiReferralCode,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: RedeemPerpsSushiReferralCodeMutation,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.perps.redeemReferralCode
  }

  throw new Error('No redeemed perps sushi referral code')
}

export type RedeemedPerpsSushiReferralCode = Awaited<
  ReturnType<typeof redeemPerpsSushiReferralCode>
>
