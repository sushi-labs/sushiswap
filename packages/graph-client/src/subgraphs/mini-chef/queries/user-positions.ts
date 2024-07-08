import type { VariablesOf } from 'gql.tada'

import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import type { RequestOptions } from 'src/lib/request'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import type { MiniChefChainId } from 'sushi/config'
import { MINICHEF_SUBGRAPH_URL } from 'sushi/config/subgraph'
import { SushiSwapProtocol } from 'sushi/types'
import { graphql } from '../graphql'

export const MiniChefUserPositionsQuery = graphql(
  `
  query UserPositions($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: User_orderBy, $orderDirection: OrderDirection, $where: User_filter) {
    users(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
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

export type GetMiniChefUserPositions = VariablesOf<
  typeof MiniChefUserPositionsQuery
> &
  ChainIdVariable<MiniChefChainId>

export async function getMiniChefUserPositions(
  { chainId, ...variables }: GetMiniChefUserPositions,
  options?: RequestOptions,
) {
  const url = `https://${MINICHEF_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: MiniChefUserPositionsQuery,
    variables,
    options,
  })

  return result.users.flatMap((position) => {
    if (!position.pool) {
      return []
    }

    const pool = {
      ...convertIdToMultichainId(
        copyIdToAddress(addChainId(chainId, position.pool)),
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

export type MiniChefUserPositions = Awaited<
  ReturnType<typeof getMiniChefUserPositions>
>
