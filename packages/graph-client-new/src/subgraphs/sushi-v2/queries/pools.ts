import {
  SUSHISWAP_SUBGRAPH_URL,
  type SushiSwapChainId,
} from '@sushiswap/graph-config'
import type { ResultOf, VariablesOf } from 'gql.tada'

import type { ChainIdVariable } from 'src/chainId'
import { requestPaged } from 'src/lib/request-paged'
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
  ChainIdVariable<SushiSwapChainId>

export async function getSushiV2Pools({
  chainId,
  ...variables
}: GetSushiV2Pools) {
  const url = `https://${SUSHISWAP_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV2PoolsQuery,
    variables,
  })

  if (result) {
    return result.pools
  }

  throw new Error('Failed to fetch pools')
}

export type SushiV2Pools = NonNullable<
  ResultOf<typeof SushiV2PoolsQuery>
>['pools']
