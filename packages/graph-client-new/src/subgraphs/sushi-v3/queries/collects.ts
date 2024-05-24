import {
  SUSHISWAP_V3_SUBGRAPH_URL,
  type SushiSwapV3ChainId,
} from '@sushiswap/graph-config'
import type { ResultOf, VariablesOf } from 'gql.tada'

import type { ChainIdVariable } from 'src/chainId'
import { requestPaged } from 'src/lib/request-paged'
import { graphql } from '../graphql'

export const SushiV3CollectsQuery = graphql(`
  query Collects($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Collect_orderBy, $orderDirection: OrderDirection, $where: Collect_filter) {
    collects(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      owner
      amount0
      amount1
      amountUSD
      logIndex
      transaction {
        id
        timestamp
        blockNumber
      }
    }
  }
`)

export type GetSushiV3Collects = VariablesOf<typeof SushiV3CollectsQuery> &
  ChainIdVariable<SushiSwapV3ChainId>

export async function getSushiV3Collects({
  chainId,
  ...variables
}: GetSushiV3Collects) {
  const url = `https://${SUSHISWAP_V3_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV3CollectsQuery,
    variables,
  })

  if (result) {
    return result.collects
  }

  throw new Error('Failed to fetch collects')
}

export type SushiV3Collects = NonNullable<
  ResultOf<typeof SushiV3CollectsQuery>
>['collects']
