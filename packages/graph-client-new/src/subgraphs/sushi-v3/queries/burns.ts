import {
  SUSHISWAP_V3_SUBGRAPH_URL,
  type SushiSwapV3ChainId,
} from '@sushiswap/graph-config'
import type { ResultOf, VariablesOf } from 'gql.tada'

import type { ChainIdVariable } from 'src/chainId'
import { requestPaged } from 'src/lib/request-paged'
import { graphql } from '../graphql'

export const SushiV3BurnsQuery = graphql(`
  query Burns($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Burn_orderBy, $orderDirection: OrderDirection, $where: Burn_filter) {
    burns(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      owner
      origin
      amount
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

export type GetSushiV3Burns = VariablesOf<typeof SushiV3BurnsQuery> &
  ChainIdVariable<SushiSwapV3ChainId>

export async function getSushiV3Burns({
  chainId,
  ...variables
}: GetSushiV3Burns) {
  const url = `https://${SUSHISWAP_V3_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV3BurnsQuery,
    variables,
  })

  if (result) {
    return result.burns
  }

  throw new Error('Failed to fetch burns')
}

export type SushiV3Burns = NonNullable<
  ResultOf<typeof SushiV3BurnsQuery>
>['burns']
