import {
  SUSHISWAP_V3_SUBGRAPH_URL,
  type SushiSwapV3ChainId,
} from '@sushiswap/graph-config'
import type { VariablesOf } from 'gql.tada'

import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { graphql } from '../graphql'

export const SushiV3MintsQuery = graphql(`
  query Mints($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Mint_orderBy, $orderDirection: OrderDirection, $where: Mint_filter) {
    mints(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      owner
      sender
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

export type GetSushiV3Mints = VariablesOf<typeof SushiV3MintsQuery> &
  ChainIdVariable<SushiSwapV3ChainId>

export async function getSushiV3Mints({
  chainId,
  ...variables
}: GetSushiV3Mints) {
  const url = `https://${SUSHISWAP_V3_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV3MintsQuery,
    variables,
  })

  if (result) {
    return result.mints.map((mint) => addChainId(chainId, mint))
  }

  throw new Error('Failed to fetch mints')
}

export type SushiV3Mints = Awaited<ReturnType<typeof getSushiV3Mints>>
