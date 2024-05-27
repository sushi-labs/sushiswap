import type { VariablesOf } from 'gql.tada'
import type { SushiSwapV2ChainId } from 'sushi/config'
import { SUSHISWAP_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'

import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
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
        createdAtTimestamp: timestamp
        createdAtBlock: blockNumber
      }
    }
  }
`)

export type GetSushiV2Mints = VariablesOf<typeof SushiV2MintsQuery> &
  ChainIdVariable<SushiSwapV2ChainId>

export async function getSushiV2Mints({
  chainId,
  ...variables
}: GetSushiV2Mints) {
  const url = `https://${SUSHISWAP_V2_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV2MintsQuery,
    variables,
  })

  return result.mints
}

export type SushiV2Mints = Awaited<ReturnType<typeof getSushiV2Mints>>
