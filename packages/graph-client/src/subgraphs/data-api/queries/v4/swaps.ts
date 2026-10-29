import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

export const SushiV4SwapsQuery = graphql(`
  query V4Swaps($poolId: Bytes!, $chainId: SushiSwapV4ChainId!) {
    v4Swaps(poolId: $poolId, chainId: $chainId) {
      id
      logIndex
      amountUSD
      amount1
      amount0
      origin
      sender
      transaction {
        id
        blockNumber
        timestamp
      }
    }
  }
`)

export type GetSushiV4Swaps = VariablesOf<typeof SushiV4SwapsQuery>

export async function getSushiV4Swaps(
  variables: GetSushiV4Swaps,
  options?: RequestOptions,
) {
  const url = SUSHI_DATA_API_GRAPHQL_URL

  const result = await request(
    {
      url,
      document: SushiV4SwapsQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.v4Swaps
  }

  throw new Error(`Failed to fetch swaps for ${variables.chainId}`)
}

export type SushiV4Swaps = Awaited<ReturnType<typeof getSushiV4Swaps>>
