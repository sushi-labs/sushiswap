import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from 'sushi/evm'
import { graphql } from '../../graphql.js'

export const SushiV2SwapsQuery = graphql(`
query V2Swaps($address: Bytes!, $chainId: SushiSwapV2ChainId!) {
  v2Swaps(address: $address, chainId: $chainId) {
    transaction {
      createdAtBlock
      createdAtTimestamp
      id
    }
    logIndex
    amountUSD
    amount1Out
    amount0Out
    amount1In
    amount0In
    to
    sender
    id
  }
}
`)

export type GetSushiV2Swaps = VariablesOf<typeof SushiV2SwapsQuery>

export async function getSushiV2Swaps(
  { ...variables }: GetSushiV2Swaps,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    { url, document: SushiV2SwapsQuery, variables },
    options,
  )

  if (result) {
    return result.v2Swaps
  }

  throw new Error(`Failed to fetch swaps for ${variables.chainId}`)
}

export type SushiV2Swaps = Awaited<ReturnType<typeof getSushiV2Swaps>>
