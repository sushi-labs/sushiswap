import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const PerpsSushiReferredUsersQuery = graphql(
  `
   query PerpsSushiReferredUsers($address: EvmAddress!) {
      perps {
        referredUsers(address: $address) {
          children {
            shareBps
            refereeAddress
            linkedAt
            lifetimeEarnedFees
            level
            lastEarnedAt
            downlineEarnedFees
          }
          downlineEarnedFees
          lastEarnedAt
          level
          lifetimeEarnedFees
          linkedAt
          refereeAddress
          shareBps
        }
      }
    }
  `,
)

export type GetPerpsSushiReferredUsers = VariablesOf<
  typeof PerpsSushiReferredUsersQuery
>

export async function getPerpsSushiReferredUsers(
  variables: GetPerpsSushiReferredUsers,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: PerpsSushiReferredUsersQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.perps.referredUsers
  }

  throw new Error('No perps sushi referred users')
}

export type PerpsSushiReferredUsers = Awaited<
  ReturnType<typeof getPerpsSushiReferredUsers>
>
export type PerpsSushiReferredUser = PerpsSushiReferredUsers[number]
