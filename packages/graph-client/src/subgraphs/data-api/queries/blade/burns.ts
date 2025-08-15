import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
// import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'

export const BladeBurnsQuery = graphql(`
  query BladeBurns($address: Bytes!, $chainId: BladeChainId!) {
    bladeBurns(address: $address, chainId: $chainId) {
      amountUSD
      timestamp
      txHash
      user
    }
  }
`)

export type GetBladeBurns = VariablesOf<typeof BladeBurnsQuery>

export async function getBladeBurns(
  { ...variables }: GetBladeBurns,
  options?: RequestOptions,
): Promise<BladeBurn[]> {
  // const url = `${SUSHI_DATA_API_HOST}/graphql`
  const url = `https://data-api-staging.data-gcp.sushi.com/graphql`

  const result = await request(
    { url, document: BladeBurnsQuery, variables },
    options,
  )

  console.log('result', result)

  if (result) {
    return result.bladeBurns as BladeBurn[]
  }

  throw new Error(`Failed to fetch burns for ${variables.chainId}`)
}

export type BladeBurns = Awaited<ReturnType<typeof getBladeBurns>>

export type BladeBurn = {
  amountUSD: number
  timestamp: number
  txHash: string
  user: string
}
