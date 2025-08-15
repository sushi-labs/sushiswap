import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
// import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'

export const BladeSwapsQuery = graphql(`
query BladeSwaps($address: Bytes!, $chainId: BladeChainId!) {
  bladeSwaps(address: $address, chainId: $chainId) {
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
): Promise<BladeSwap[]> {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`
  const url = `https://data-api-staging.data-gcp.sushi.com/graphql`

  const result = await request(
    { url, document: BladeSwapsQuery, variables },
    options,
  )

  if (result) {
    return result.bladeSwaps as BladeSwap[]
  }

  throw new Error(`Failed to fetch swaps for ${variables.chainId}`)
}

export type BladeSwaps = Awaited<ReturnType<typeof getBladeSwaps>>

export type BladeSwapToken = {
  id: string
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
}

export type BladeSwap = {
  txHash: string
  user: string
  timestamp: number
  amountInUSD: number
  amountInRaw: number
  inToken: BladeSwapToken
  amountOutUSD: number
  amountOutRaw: number
  outToken: BladeSwapToken
  feeUSD: number
}
