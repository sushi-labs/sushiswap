import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const PerpsClaimQuery = graphql(
  `
    query PerpsClaim($address: EvmAddress!) {
      perps {
        claim(address: $address) {
          root
          distributor
          token
          cumulativeAmount
          alreadyClaimedAmount
          claimableAmount
          proof
          updatedAt
        }
      }
    }
  `,
)

export type GetPerpsClaim = VariablesOf<typeof PerpsClaimQuery>

export async function getPerpsClaim(
  variables: GetPerpsClaim,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: PerpsClaimQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.perps.claim
  }

  throw new Error('No perps claim data')
}

export type PerpsClaimType = Awaited<ReturnType<typeof getPerpsClaim>>
