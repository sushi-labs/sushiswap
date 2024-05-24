import {
  SUSHISWAP_SUBGRAPH_URL,
  type SushiSwapChainId,
} from '@sushiswap/graph-config'
import type { ResultOf, VariablesOf } from 'gql.tada'

import type { ChainIdVariable } from 'src/chainId'
import { requestPaged } from 'src/lib/request-paged'
import { graphql } from '../graphql'

export const SushiV2LiquidityPositionsQuery = graphql(`
  query LiquidityPositions($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: LiquidityPosition_orderBy, $orderDirection: OrderDirection, $where: LiquidityPosition_filter) {
    liquidityPositions(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      balance
      pair {
        id
      }
      user {
        id
      }
    }
  }
`)

export type GetSushiV2LiquidityPositions = VariablesOf<
  typeof SushiV2LiquidityPositionsQuery
> &
  ChainIdVariable<SushiSwapChainId>

export async function getSushiV2LiquidityPositions({
  chainId,
  ...variables
}: GetSushiV2LiquidityPositions) {
  const url = `https://${SUSHISWAP_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV2LiquidityPositionsQuery,
    variables,
  })

  if (result) {
    return result.liquidityPositions
  }

  throw new Error('Failed to fetch liquidity positions')
}

export type SushiV2LiquidityPositions = NonNullable<
  ResultOf<typeof SushiV2LiquidityPositionsQuery>
>['liquidityPositions']
