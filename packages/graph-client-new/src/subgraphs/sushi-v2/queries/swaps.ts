import {
  SUSHISWAP_SUBGRAPH_URL,
  type SushiSwapChainId,
} from '@sushiswap/graph-config'
import type { VariablesOf } from 'gql.tada'

import { FetchError } from 'src/lib/fetch-error'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { graphql } from '../graphql'

export const SushiV2SwapsQuery = graphql(`
  query Swaps($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Swap_orderBy, $orderDirection: OrderDirection, $where: Swap_filter) {
    swaps(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      sender
      to
      amountIn
      tokenIn {
        symbol
      }
      amountOut
      tokenOut {
        symbol
      }
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

export type GetSushiV2Swaps = VariablesOf<typeof SushiV2SwapsQuery> &
  ChainIdVariable<SushiSwapChainId>

export async function getSushiV2Swaps({
  chainId,
  ...variables
}: GetSushiV2Swaps) {
  const url = `https://${SUSHISWAP_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV2SwapsQuery,
    variables,
  })

  if (result) {
    return result.swaps
  }

  throw new FetchError(chainId, 'Failed to fetch swaps')
}

export type SushiV2Swaps = Awaited<ReturnType<typeof getSushiV2Swaps>>
