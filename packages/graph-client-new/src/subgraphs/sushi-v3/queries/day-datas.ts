import {
  SUSHISWAP_V3_SUBGRAPH_URL,
  type SushiSwapV3ChainId,
} from '@sushiswap/graph-config'
import type { VariablesOf } from 'gql.tada'

import type { ChainIdVariable } from 'src/chainId'
import { requestPaged } from 'src/lib/request-paged'
import { graphql } from '../graphql'

export const SushiV3DayDatasQuery = graphql(`
  query DayDatas($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: UniswapDayData_orderBy, $orderDirection: OrderDirection, $where: UniswapDayData_filter) {
    uniswapDayDatas(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      date
      volumeETH
      volumeUSD
      volumeUSDUntracked
      feesUSD
      txCount
      tvlUSD
    }
  }
`)

export type GetSushiV3DayDatas = VariablesOf<typeof SushiV3DayDatasQuery> &
  ChainIdVariable<SushiSwapV3ChainId>

export async function getSushiV3DayDatas({
  chainId,
  ...variables
}: GetSushiV3DayDatas) {
  const url = `https://${SUSHISWAP_V3_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV3DayDatasQuery,
    variables,
  })

  if (result) {
    return result.uniswapDayDatas
  }

  throw new Error('Failed to fetch day datas')
}

export type SushiV3DayDatas = Awaited<ReturnType<typeof getSushiV3DayDatas>>
