import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const PointClaimProofQuery = graphql(
  `
    query PointClaimProof($address: EvmAddress!, $season: PerpsPointsSeason!) {
      perps {
        pointClaimProof(address: $address, season: $season) {
          account
          amount
          displayAmount
          leaf
          proof
        }
      }
    }
  `,
)

export type GetPointClaimProof = VariablesOf<typeof PointClaimProofQuery>

export async function getPointClaimProof(
  variables: GetPointClaimProof,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    {
      url,
      document: PointClaimProofQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.perps.pointClaimProof
  }

  throw new Error('No perps point claim proof')
}

export type PointClaimProof = Awaited<ReturnType<typeof getPointClaimProof>>
