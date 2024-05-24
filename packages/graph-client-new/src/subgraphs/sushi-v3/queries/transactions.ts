import {
  SUSHISWAP_V3_SUBGRAPH_URL,
  type SushiSwapV3ChainId,
} from '@sushiswap/graph-config'
import type { VariablesOf } from 'gql.tada'

import type { ChainIdVariable } from 'src/chainId'
import { requestPaged } from 'src/lib/request-paged'
import { graphql } from '../graphql'

export const SushiV3TransactionsQuery = graphql(`
  query Transactions($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Transaction_orderBy, $orderDirection: OrderDirection, $where: Transaction_filter) {
    transactions(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      timestamp
      blockNumber
      mints {
        id
        owner
        sender
        origin
        amount
        amount0
        amount1
        amountUSD
        logIndex
      }
      burns {
        id
        owner
        origin
        amount
        amount0
        amount1
        amountUSD
        logIndex
      }
      swaps {
        id
        sender
        recipient
        origin
        amount0
        amount1
        amountUSD
        logIndex
      }
      collects {
        id
        owner
        amount0
        amount1
        amountUSD
        logIndex
      }
    }
  }
`)

export type GetSushiV3Transactions = VariablesOf<
  typeof SushiV3TransactionsQuery
> &
  ChainIdVariable<SushiSwapV3ChainId>

export async function getSushiV3Transactions({
  chainId,
  ...variables
}: GetSushiV3Transactions) {
  const url = `https://${SUSHISWAP_V3_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV3TransactionsQuery,
    variables,
  })

  if (result) {
    return result.transactions
  }

  throw new Error('Failed to fetch transactions')
}

export type SushiV3Transactions = Awaited<
  ReturnType<typeof getSushiV3Transactions>
>
