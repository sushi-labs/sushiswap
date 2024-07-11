import type { VariablesOf } from 'gql.tada'

import { BONDS_SUBGRAPH_URL, type BondChainId } from '@sushiswap/bonds-sdk'
import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import type { RequestOptions } from 'src/lib/request'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import type { Hex } from 'src/lib/types/hex'
import { graphql } from '../graphql'

export const BondUserPositionsQuery = graphql(
  `
  query UserPositions($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: OwnerBalance_orderBy, $orderDirection: OrderDirection, $where: OwnerBalance_filter) {
    ownerBalances(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      owner
      balance
      bondToken {
        id
        expiry
        type
        teller
        underlying {
          id: address
          symbol
          decimals
          name
        }
      }
    }
  }
`,
)

export type GetBondUserPositions = VariablesOf<typeof BondUserPositionsQuery> &
  ChainIdVariable<BondChainId>

export async function getBondUserPositions(
  { chainId, ...variables }: GetBondUserPositions,
  options?: RequestOptions,
) {
  const url = `https://${BONDS_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: BondUserPositionsQuery,
    variables,
    options,
  })

  return result.ownerBalances.map((position) => {
    const bondTokenUnderlying = position.bondToken
      ? convertIdToMultichainId(
          copyIdToAddress(
            addChainId(
              chainId,
              position.bondToken
                .underlying as typeof position.bondToken.underlying & {
                id: Hex
              },
            ),
          ),
        )
      : null

    return addChainId(chainId, {
      ...position,
      bondToken: {
        ...position.bondToken,
        underlying: bondTokenUnderlying,
      },
    })
  })
}

export type BondUserPositions = Awaited<ReturnType<typeof getBondUserPositions>>
