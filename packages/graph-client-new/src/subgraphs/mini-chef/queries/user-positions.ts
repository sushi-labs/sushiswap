import {
  MINICHEF_SUBGRAPH_URL,
  type MiniChefChainId,
} from '@sushiswap/graph-config'
import type { VariablesOf } from 'gql.tada'

import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { graphql } from '../graphql'

export const MiniChefUserPositionsQuery = graphql(
  `
  query UserPositions($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: User_orderBy, $orderDirection: OrderDirection, $where: User_filter) {
    positions: users(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      address
      amount
      pool {
        id: pair
      }
    }
  }
`,
)

export type GetMiniChefUserPositions = VariablesOf<
  typeof MiniChefUserPositionsQuery
> &
  ChainIdVariable<MiniChefChainId>

export async function getMiniChefUserPositions({
  chainId,
  ...variables
}: GetMiniChefUserPositions) {
  const url = `https://${MINICHEF_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: MiniChefUserPositionsQuery,
    variables,
  })

  return result.positions.map((position) => {
    let pool = null

    if (position.pool) {
      pool = convertIdToMultichainId(
        copyIdToAddress(addChainId(chainId, position.pool)),
      )
    }

    return {
      id: position.id,
      address: position.address,
      amount: position.amount,
      pool,
    }
  })
}

export type MiniChefUserPositions = Awaited<
  ReturnType<typeof getMiniChefUserPositions>
>
