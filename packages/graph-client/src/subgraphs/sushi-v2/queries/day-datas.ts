import type { VariablesOf } from 'gql.tada'
import type { SushiSwapV2ChainId } from 'sushi/config'
import { SUSHISWAP_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'

import type { RequestOptions } from 'src/lib/request'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { graphql } from '../graphql'

export const SushiV2DayDatasQuery = graphql(`
  query DayDatas($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: UniswapDayData_orderBy, $orderDirection: OrderDirection, $where: UniswapDayData_filter) {
    uniswapDayDatas(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      date
      dailyVolumeUSD
      dailyVolumeUntracked
      totalLiquidityUSD
      txCount
    }
  }
`)

export type GetSushiV2DayDatas = VariablesOf<typeof SushiV2DayDatasQuery> &
  ChainIdVariable<SushiSwapV2ChainId>

export async function getSushiV2DayDatas(
  { chainId, ...variables }: GetSushiV2DayDatas,
  options?: RequestOptions,
) {
  const url = `https://${SUSHISWAP_V2_SUBGRAPH_URL[chainId]}`

  const result = await requestPaged({
    chainId,
    url,
    query: SushiV2DayDatasQuery,
    variables,
    options,
  })

  return result.uniswapDayDatas.map((dayData) => ({
    id: dayData.id,
    date: dayData.date,
    volumeUSD: Number(dayData.dailyVolumeUSD),
    volumeUSDUntracked: Number(dayData.dailyVolumeUntracked),
    liquidityUSD: Number(dayData.totalLiquidityUSD),
    txCount: Number(dayData.txCount),
    feesUSD: Number(dayData.totalLiquidityUSD) * 0.003,
  }))
}

export type SushiV2DayDatas = Awaited<ReturnType<typeof getSushiV2DayDatas>>
