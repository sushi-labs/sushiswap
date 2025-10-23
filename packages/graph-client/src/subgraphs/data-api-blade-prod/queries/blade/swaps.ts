import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { graphql } from '../../graphql.js'

export const BladeSwapsQuery = graphql(`
query BladeSwaps($address: Bytes!, $chainId: BladeChainId!, $user: Bytes) {
  bladeSwaps(address: $address, chainId: $chainId, user: $user) {
    txHash
    user
    timestamp
    amountInUSD
    amountInRaw
    inToken {
      id
      chainId
      address
      name
      symbol
      decimals
    }
    amountOutUSD
    amountOutRaw
    outToken {
      id
      chainId
      address
      name
      symbol
      decimals
    }
    feeUSD
  }
}
`)

export type GetBladeSwaps = VariablesOf<typeof BladeSwapsQuery>

export async function getBladeSwaps(
  { ...variables }: GetBladeSwaps,
  options?: RequestOptions,
) {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`
  const url = `https://data-api-feat-sushi2.data-gcp.sushi.com/graphql`

  const result = await request(
    { url, document: BladeSwapsQuery, variables },
    options,
  )

  if (result) {
    return result.bladeSwaps
  }

  throw new Error(`Failed to fetch swaps for ${variables.chainId}`)
}
