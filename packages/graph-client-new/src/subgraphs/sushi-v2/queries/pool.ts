import {
  SUSHISWAP_SUBGRAPH_URL,
  type SushiSwapChainId,
} from '@sushiswap/graph-config'
import type { VariablesOf } from 'gql.tada'
import request from 'graphql-request'

import type { ChainIdVariable } from 'src/chainId'
import { PoolFieldsFragment } from '../fragments/pool-fields'
import { graphql } from '../graphql'

export const SushiV2PoolQuery = graphql(
  `
  query Pool($id: ID!, $block: Block_height) {
    pool: pair(id: $id, block: $block) {
      ...PoolFields
    }
  }
`,
  [PoolFieldsFragment],
)

export type GetSushiV2Pool = VariablesOf<typeof SushiV2PoolQuery> &
  ChainIdVariable<SushiSwapChainId>

export async function getSushiV2Pool({
  chainId,
  ...variables
}: GetSushiV2Pool) {
  const url = `https://${SUSHISWAP_SUBGRAPH_URL[chainId]}`

  const result = await request(url, SushiV2PoolQuery, variables)

  if (result.pool) {
    return result.pool
  }

  throw new Error(`Failed to fetch pool ${chainId}:${variables.id}`)
}

export type SushiV2Pool = Awaited<ReturnType<typeof getSushiV2Pool>>
