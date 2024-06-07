import type { VariablesOf } from 'gql.tada'
import type { SushiSwapV3ChainId } from 'sushi/config'
import { SUSHISWAP_V3_SUBGRAPH_URL } from 'sushi/config/subgraph'

import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { graphql } from '../graphql'
import type { RequestOptions } from 'src/lib/request'

export const SushiV3DayDatasQuery = graphql(`
  query DayDatas($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: UniswapDayData_orderBy, $orderDirection: OrderDirection, $where: UniswapDayData_filter) {
    uniswapDayDatas(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      date
      volumeUSD
      volumeUSDUntracked
      volumeETH
      tvlUSD
      feesUSD
      txCount
    }
  }
`)

export type GetSushiV3DayDatas = VariablesOf<typeof SushiV3DayDatasQuery> &
  ChainIdVariable<SushiSwapV3ChainId>

export async function getSushiV3DayDatas(
  { chainId, ...variables }: GetSushiV3DayDatas,
  options?: RequestOptions,
) {
  const url = `https://${SUSHISWAP_V3_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV3DayDatasQuery,
    variables,
    options,
  })

  return result.uniswapDayDatas
}

export type SushiV3DayDatas = Awaited<ReturnType<typeof getSushiV3DayDatas>>
