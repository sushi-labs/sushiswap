import {
  SUSHISWAP_SUBGRAPH_URL,
  type SushiSwapChainId,
} from '@sushiswap/graph-config'
import type { ResultOf, VariablesOf } from 'gql.tada'

import type { ChainIdVariable } from 'src/chainId'
import { requestPaged } from 'src/lib/request-paged'
import { graphql } from '../graphql'

export const SushiV2TransactionsQuery = graphql(`
  query Transactions($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Transaction_orderBy, $orderDirection: OrderDirection, $where: Transaction_filter) {
    transactions(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      createdAtTimestamp
      createdAtBlock
      mints {
        id
        sender
        liquidity
        amount0
        amount1
        amountUSD
        logIndex
      }
      burns {
        id
        sender
        liquidity
        amount0
        amount1
        amountUSD
        logIndex
      }
      swaps {
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
      }
    }
  }
`)

export type GetSushiV2Transactions = VariablesOf<
  typeof SushiV2TransactionsQuery
> &
  ChainIdVariable<SushiSwapChainId>

export async function getSushiV2Transactions({
  chainId,
  ...variables
}: GetSushiV2Transactions) {
  const url = `https://${SUSHISWAP_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV2TransactionsQuery,
    variables,
  })

  if (result) {
    return result.transactions
  }

  return []
}

export type SushiV2Transactions = NonNullable<
  ResultOf<typeof SushiV2TransactionsQuery>
>['transactions']
