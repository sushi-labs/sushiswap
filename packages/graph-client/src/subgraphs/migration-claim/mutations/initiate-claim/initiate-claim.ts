import type { VariablesOf } from 'gql.tada'
import { type RequestOptions, request } from 'src/lib/request.js'
import { MIGRATION_CLAIM_GRAPHQL_URL } from '../../constants.js'
import { graphql } from '../../graphql.js'

export const InitiateClaimMutation = graphql(
  `
  mutation Mutation($signature: String!, $message: String!, $address: String!, $chainId: Int!) {
    initiateClaim(signature: $signature, message: $message, address: $address, chainId: $chainId) {
      success
      message
    }
  }
`,
)

export type InitiateClaim = VariablesOf<typeof InitiateClaimMutation>

export async function initiateClaim(
  variables: InitiateClaim,
  options?: RequestOptions,
) {
  const url = `${MIGRATION_CLAIM_GRAPHQL_URL}/graphql`

  const result = await request(
    { url, document: InitiateClaimMutation, variables },
    options,
  )
  if (result) {
    return result.initiateClaim
  }

  throw new Error('No initiate claim data')
}

export type InitiateClaimType = Awaited<ReturnType<typeof initiateClaim>>
