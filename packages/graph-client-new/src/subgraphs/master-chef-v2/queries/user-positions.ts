import type { VariablesOf } from 'gql.tada'
import { ChainId } from 'sushi/chain'
import { MASTERCHEF_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'

import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import { requestPaged } from 'src/lib/request-paged'
import { graphql } from '../graphql'

export const MasterChefV2UserPositionsQuery = graphql(
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

export type GetMasterChefV2UserPositions = VariablesOf<
  typeof MasterChefV2UserPositionsQuery
>

export async function getMasterChefV2UserPositions({
  ...variables
}: GetMasterChefV2UserPositions) {
  const url = `https://${MASTERCHEF_V2_SUBGRAPH_URL}`

  const result = await requestPaged({
    chainId: ChainId.ETHEREUM,
    url,
    query: MasterChefV2UserPositionsQuery,
    variables,
  })

  return result.positions.map((position) => {
    let pool = null

    if (position.pool) {
      pool = convertIdToMultichainId(
        copyIdToAddress(addChainId(ChainId.ETHEREUM, position.pool)),
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

export type MasterChefV2UserPositions = Awaited<
  ReturnType<typeof getMasterChefV2UserPositions>
>
