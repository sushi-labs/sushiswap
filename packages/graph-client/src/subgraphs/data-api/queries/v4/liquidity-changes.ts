import type { VariablesOf } from 'gql.tada'

import { type RequestOptions, request } from 'src/lib/request.js'
import { SUSHI_DATA_API_GRAPHQL_URL } from '../../data-api-host.js'
import { graphql } from '../../graphql.js'
import { SUSHI_REQUEST_HEADERS } from '../../request-headers.js'

const V4LiquidityChangeFragment = graphql(`
  fragment V4LiquidityChangeFields on V4LiquidityChange @_unmask {
    id
    logIndex
    amountUSD
    amount1
    amount0
    origin
    transaction {
      id
      blockNumber
      timestamp
    }
  }
`)

export const SushiV4MintsQuery = graphql(
  `
  query V4Mints($poolId: Bytes!, $chainId: SushiSwapV4ChainId!) {
    v4Mints(poolId: $poolId, chainId: $chainId) {
      ...V4LiquidityChangeFields
    }
  }
`,
  [V4LiquidityChangeFragment],
)

export const SushiV4BurnsQuery = graphql(
  `
  query V4Burns($poolId: Bytes!, $chainId: SushiSwapV4ChainId!) {
    v4Burns(poolId: $poolId, chainId: $chainId) {
      ...V4LiquidityChangeFields
    }
  }
`,
  [V4LiquidityChangeFragment],
)

export type GetSushiV4LiquidityChanges = VariablesOf<typeof SushiV4MintsQuery>

export async function getSushiV4Mints(
  variables: GetSushiV4LiquidityChanges,
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: SushiV4MintsQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.v4Mints
  }

  throw new Error(`Failed to fetch mints for ${variables.chainId}`)
}

export async function getSushiV4Burns(
  variables: GetSushiV4LiquidityChanges,
  options?: RequestOptions,
) {
  const result = await request(
    {
      url: SUSHI_DATA_API_GRAPHQL_URL,
      document: SushiV4BurnsQuery,
      variables,
      requestHeaders: SUSHI_REQUEST_HEADERS,
    },
    options,
  )

  if (result) {
    return result.v4Burns
  }

  throw new Error(`Failed to fetch burns for ${variables.chainId}`)
}

export type SushiV4LiquidityChanges = Awaited<
  ReturnType<typeof getSushiV4Mints>
>
