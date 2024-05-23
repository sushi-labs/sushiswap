import {
  SUSHISWAP_SUBGRAPH_URL,
  type SushiSwapChainId,
} from '@sushiswap/graph-config'
import type { ResultOf, VariablesOf } from 'gql.tada'

import { requestPaged } from 'src/lib/request-paged'
import { graphql } from '../graphql'

export const SushiV2MintsQuery = graphql(`
  query Mints($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Mint_orderBy, $orderDirection: OrderDirection, $where: Mint_filter) {
    mints(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      sender
      liquidity
      amount0
      amount1
      amountUSD
      logIndex
      transaction {
        id
        createdAtTimestamp
        createdAtBlock
      }
    }
  }
`)

export type GetSushiV2Mints = VariablesOf<typeof SushiV2MintsQuery>

export async function getSushiV2Mints(
  chainId: SushiSwapChainId,
  variables: GetSushiV2Mints,
) {
  const url = `https://${SUSHISWAP_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV2MintsQuery,
    variables,
  })

  if (result) {
    return result.mints
  }

  return []
}

export type SushiV2Mints = NonNullable<
  ResultOf<typeof SushiV2MintsQuery>
>['mints']
