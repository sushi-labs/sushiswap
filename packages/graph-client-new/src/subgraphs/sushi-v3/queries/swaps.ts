import {
  SUSHISWAP_V3_SUBGRAPH_URL,
  type SushiSwapV3ChainId,
} from '@sushiswap/graph-config'
import type { ResultOf, VariablesOf } from 'gql.tada'

import type { ChainIdVariable } from 'src/chainId'
import { requestPaged } from 'src/lib/request-paged'
import { graphql } from '../graphql'

export const SushiV3SwapsQuery = graphql(`
  query Swaps($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Swap_orderBy, $orderDirection: OrderDirection, $where: Swap_filter) {
    swaps(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      sender
      recipient
      origin
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

export type GetSushiV3Swaps = VariablesOf<typeof SushiV3SwapsQuery> &
  ChainIdVariable<SushiSwapV3ChainId>

export async function getSushiV3Swaps({
  chainId,
  ...variables
}: GetSushiV3Swaps) {
  const url = `https://${SUSHISWAP_V3_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV3SwapsQuery,
    variables,
  })

  if (result) {
    return result.swaps
  }

  return []
}

export type SushiV3Swaps = NonNullable<
  ResultOf<typeof SushiV3SwapsQuery>
>['swaps']
