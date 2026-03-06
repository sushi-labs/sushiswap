import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { MIGRATION_CLAIM_GRAPHQL_URL } from '../../constants.js'
import { graphql } from '../../graphql.js'

export const SnapshotCheckQuery = graphql(
  `
  query SnapshotCheck($address: String!) {
    snapshotCheck(address: $address) {
      masterChefV1Positions {
        positions {
          balance
          user
        }
        poolAddress
      }
      isOnAnySnapshot
      claimStatus {
        hasInitiatedClaim
        status
      }
    }
  }
`,
)

export type GetSnapshotCheck = VariablesOf<typeof SnapshotCheckQuery>

export async function getSnapshotCheck(
  variables: GetSnapshotCheck,
  options?: RequestOptions,
) {
  const url = `${MIGRATION_CLAIM_GRAPHQL_URL}/graphql`

  const result = await request(
    { url, document: SnapshotCheckQuery, variables },
    options,
  )
  if (result) {
    return {
      ...result.snapshotCheck,
      claimStatus: {
        hasInitiatedClaim: result.snapshotCheck.claimStatus.hasInitiatedClaim,
        status: result.snapshotCheck.claimStatus.status as
          | 'pending'
          | 'processing'
          | 'completed'
          | 'failed'
          | null,
      },
    }
  }

  throw new Error('No snapshot check data')
}

export type SnapshotCheckType = Awaited<ReturnType<typeof getSnapshotCheck>>
