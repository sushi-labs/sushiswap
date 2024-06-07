import type { VariablesOf } from 'gql.tada'
import type { SushiSwapV2ChainId } from 'sushi/config'
import { SUSHISWAP_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'

import type { RequestOptions } from 'src/lib/request'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { graphql } from '../graphql'

export const SushiV2SwapsQuery = graphql(`
  query Swaps($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Swap_orderBy, $orderDirection: OrderDirection, $where: Swap_filter) {
    swaps(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      sender
      to
      amount0In
      amount1In
      amount0Out
      amount1Out
      amountUSD
      logIndex
      amountUSD
      logIndex
      transaction {
        id
        createdAtTimestamp: timestamp
        createdAtBlock: blockNumber
      }
    }
  }
`)

export type GetSushiV2Swaps = VariablesOf<typeof SushiV2SwapsQuery> &
  ChainIdVariable<SushiSwapV2ChainId>

export async function getSushiV2Swaps(
  { chainId, ...variables }: GetSushiV2Swaps,
  options?: RequestOptions,
) {
  const url = `https://${SUSHISWAP_V2_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV2SwapsQuery,
    variables,
    options,
  })

  return result.swaps
}

export type SushiV2Swaps = Awaited<ReturnType<typeof getSushiV2Swaps>>
