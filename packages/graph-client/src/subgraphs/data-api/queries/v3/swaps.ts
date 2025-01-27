import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/config/subgraph'
import { graphql } from '../../graphql.js'

export const SushiV3SwapsQuery = graphql(`
  query V3Swaps($address: Bytes!, $chainId: SushiSwapV3ChainId!) {
    v3Swaps(address: $address, chainId: $chainId) {
      id
      logIndex
      amountUSD
      amount1
      amount0
      origin
      recipient
      sender
      transaction {
        id
        blockNumber
        timestamp
      }
    }
  }
`)

export type GetSushiV3Swaps = VariablesOf<typeof SushiV3SwapsQuery>

export async function getSushiV3Swaps(
  { ...variables }: GetSushiV3Swaps,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    { url, document: SushiV3SwapsQuery, variables },
    options,
  )

  if (result) {
    return result.v3Swaps
  }

  throw new Error(`Failed to fetch swaps for ${variables.chainId}`)
}

export type SushiV3Swaps = Awaited<ReturnType<typeof getSushiV3Swaps>>
