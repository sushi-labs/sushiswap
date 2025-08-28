import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'

export const SushiV2MintsQuery = graphql(`
query V2Mints($address: Bytes!, $chainId: SushiSwapV2ChainId!, $user: Bytes) {
  v2Mints(address: $address, chainId: $chainId, user: $user) {
    id
    logIndex
    amountUSD
    amount1
    amount0
    liquidity
    sender
    transaction {
      createdAtBlock
      createdAtTimestamp
      id
    }
  }
}
`)

export type GetSushiV2Mints = VariablesOf<typeof SushiV2MintsQuery>

export async function getSushiV2Mints(
  { ...variables }: GetSushiV2Mints,
  options?: RequestOptions,
) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`
  const url = 'https://data-api-181-merge.data-gcp.sushi.com/graphql'

  const result = await request(
    { url, document: SushiV2MintsQuery, variables },
    options,
  )

  if (result) {
    return result.v2Mints
  }

  throw new Error(`Failed to fetch swaps for ${variables.chainId}`)
}

export type SushiV2Mints = Awaited<ReturnType<typeof getSushiV2Mints>>
