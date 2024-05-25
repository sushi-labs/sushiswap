import {
  SUSHISWAP_SUBGRAPH_URL,
  type SushiSwapChainId,
} from '@sushiswap/graph-config'
import type { VariablesOf } from 'gql.tada'

import { FetchError } from 'src/lib/fetch-error'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { graphql } from '../graphql'

export const SushiV2BurnsQuery = graphql(`
  query Burns($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Burn_orderBy, $orderDirection: OrderDirection, $where: Burn_filter) {
    burns(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
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

export type GetSushiV2Burns = VariablesOf<typeof SushiV2BurnsQuery> &
  ChainIdVariable<SushiSwapChainId>

export async function getSushiV2Burns({
  chainId,
  ...variables
}: GetSushiV2Burns) {
  const url = `https://${SUSHISWAP_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV2BurnsQuery,
    variables,
  })

  if (result) {
    return result.burns
  }

  throw new FetchError(chainId, 'Failed to fetch burns')
}

export type SushiV2Burns = Awaited<ReturnType<typeof getSushiV2Burns>>
