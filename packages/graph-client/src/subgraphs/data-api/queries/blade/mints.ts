import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
// import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'

export const BladeMintsQuery = graphql(`
  query BladeMints($address: Bytes!, $chainId: BladeChainId!) {
    bladeMints(address: $address, chainId: $chainId) {
      amountUSD
      timestamp
      txHash
      user
    }
  }
`)

export type GetBladeMints = VariablesOf<typeof BladeMintsQuery>

export async function getBladeMints(
  { ...variables }: GetBladeMints,
  options?: RequestOptions,
): Promise<BladeMint[]> {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`
  const url = `https://data-api-staging.data-gcp.sushi.com/graphql`

  const result = await request(
    { url, document: BladeMintsQuery, variables },
    options,
  )

  if (result) {
    return result.bladeMints as BladeMint[]
  }

  throw new Error(`Failed to fetch mints for ${variables.chainId}`)
}

export type BladeMints = Awaited<ReturnType<typeof getBladeMints>>

export type BladeMint = {
  amountUSD: number
  timestamp: number
  txHash: string
  user: string
}
