import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_HOST } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'

export const SushiV2BurnsQuery = graphql(`
query V2Burns($address: Bytes!, $chainId: SushiSwapV2ChainId!) {
  v2Burns(address: $address, chainId: $chainId) {
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

export type GetSushiV2Burns = VariablesOf<typeof SushiV2BurnsQuery>

export async function getSushiV2Burns(
  { ...variables }: GetSushiV2Burns,
  options?: RequestOptions,
) {
  const url = `${SUSHI_DATA_API_HOST}/graphql`

  const result = await request(
    { url, document: SushiV2BurnsQuery, variables },
    options,
  )

  if (result) {
    return result.v2Burns
  }

  throw new Error(`Failed to fetch burns for ${variables.chainId}`)
}

export type SushiV2Burns = Awaited<ReturnType<typeof getSushiV2Burns>>
