import type { VariablesOf } from 'gql.tada'

import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import type { RequestOptions } from 'src/lib/request'
import { requestPaged } from 'src/lib/request-paged'
import { ChainId } from 'sushi/chain'
import { MASTERCHEF_V1_SUBGRAPH_URL } from 'sushi/config/subgraph'
import { SushiSwapProtocol } from 'sushi/types'
import { graphql } from '../graphql'

export const MasterChefV1UserPositionsQuery = graphql(
  `
  query UserPositions($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: User_orderBy, $orderDirection: OrderDirection, $where: User_filter) {
    positions: users(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      address
      balance: amount
      pool {
        id: pair
      }
    }
  }
`,
)

export type GetMasterChefV1UserPositions = VariablesOf<
  typeof MasterChefV1UserPositionsQuery
>

export async function getMasterChefV1UserPositions(
  { ...variables }: GetMasterChefV1UserPositions,
  options?: RequestOptions,
) {
  const url = `https://${MASTERCHEF_V1_SUBGRAPH_URL}`

  const result = await requestPaged({
    chainId: ChainId.ETHEREUM,
    url,
    query: MasterChefV1UserPositionsQuery,
    variables,
    options,
  })

  return result.positions.flatMap((position) => {
    if (!position.pool) {
      return []
    }

    const pool = {
      ...convertIdToMultichainId(
        copyIdToAddress(addChainId(ChainId.ETHEREUM, position.pool)),
      ),
      protocol: SushiSwapProtocol.SUSHISWAP_V2,
    }

    return {
      id: position.id,
      address: position.address,
      balance: position.balance,
      pool,
    }
  })
}

export type MasterChefV1UserPositions = Awaited<
  ReturnType<typeof getMasterChefV1UserPositions>
>
