import type { VariablesOf } from 'gql.tada'
import type { SushiSwapV2ChainId } from 'sushi/config'
import { SUSHISWAP_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'

import { FetchError } from 'src/lib/fetch-error'
import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { PoolFieldsFragment } from '../fragments/pool-fields'
import { graphql } from '../graphql'

export const SushiV2PoolsQuery = graphql(
  `
  query Pools($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: Pair_orderBy, $orderDirection: OrderDirection, $where: Pair_filter) {
    pools: pairs(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      ...PoolFields
    }
  }
`,
  [PoolFieldsFragment],
)

export type GetSushiV2Pools = VariablesOf<typeof SushiV2PoolsQuery> &
  ChainIdVariable<SushiSwapV2ChainId>

export async function getSushiV2Pools({
  chainId,
  ...variables
}: GetSushiV2Pools) {
  const url = `https://${SUSHISWAP_V2_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV2PoolsQuery,
    variables,
  })

  if (result) {
    return result.pools.map((pool) =>
      convertIdToMultichainId(copyIdToAddress(addChainId(chainId, pool))),
    )
  }

  throw new FetchError(chainId, 'Failed to fetch pools')
}

export type SushiV2Pools = Awaited<ReturnType<typeof getSushiV2Pools>>
