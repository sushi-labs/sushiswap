import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'

export const SushiV3MintsQuery = graphql(`
query V3Mints($address: Bytes!, $chainId: SushiSwapV3ChainId!, $user: Bytes) {
  v3Mints(address: $address, chainId: $chainId, user: $user) {
    id
    logIndex
    amountUSD
    amount1
    amount0
    amount
    origin
    sender
    owner
    transaction {      
      id
      blockNumber
      timestamp
    }
  }
}
`)

export type GetSushiV3Mints = VariablesOf<typeof SushiV3MintsQuery>

export async function getSushiV3Mints(
  { ...variables }: GetSushiV3Mints,
  options?: RequestOptions,
) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`
  const url = 'https://data-api-feat-new-db-fields.data-gcp.sushi.com/graphql'

  const result = await request(
    { url, document: SushiV3MintsQuery, variables },
    options,
  )

  if (result) {
    return result.v3Mints
  }

  throw new Error(`Failed to fetch mints for ${variables.chainId}`)
}

export type SushiV3Mints = Awaited<ReturnType<typeof getSushiV3Mints>>
