import type { VariablesOf } from 'gql.tada'

import { request, type RequestOptions } from 'src/lib/request'
import { SUSHI_DATA_API_HOST } from '../../data-api-host'
import { graphql } from '../../graphql'

export const SushiV3CollectsQuery = graphql(`
query V3Collects($address: Bytes!, $chainId: SushiSwapV3ChainId!) {
  v3Collects(address: $address, chainId: $chainId) {
    id
    logIndex
    amountUSD
    amount1
    amount0
    owner
    transaction {
      id
      blockNumber
      timestamp
    }
  }
}
`)

export type GetSushiV3Collects = VariablesOf<typeof SushiV3CollectsQuery>

export async function getSushiV3Collects(
  { ...variables }: GetSushiV3Collects,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    { url, document: SushiV3CollectsQuery, variables },
    options,
  )

  if (result) {
    return result.v3Collects
  }

  throw new Error(`Failed to fetch collects for ${variables.chainId}`)
}

export type SushiV3Collects = Awaited<ReturnType<typeof getSushiV3Collects>>
