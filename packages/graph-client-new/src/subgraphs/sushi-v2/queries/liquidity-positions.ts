import {
  SUSHISWAP_SUBGRAPH_URL,
  type SushiSwapChainId,
} from '@sushiswap/graph-config'
import type { VariablesOf } from 'gql.tada'

import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import type { Hex } from 'src/lib/types/hex'
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
    return result.liquidityPositions.map((position) => {
      const pool = convertIdToMultichainId(
        copyIdToAddress(addChainId(chainId, position.pair)),
      )

      return {
        id: position.id,
        balance: position.balance,
        pool,
        user: position.user.id as Hex,
      }
    })
  }

  throw new Error('Failed to fetch liquidity positions')
}

export type SushiV2LiquidityPositions = Awaited<
  ReturnType<typeof getSushiV2LiquidityPositions>
>
