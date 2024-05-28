import type { ChainIdsVariable } from 'src/lib/types/chainId'
import { fetchMultichain } from 'src/multichain'
import { getSushiV2DayDatas } from 'src/subgraphs/sushi-v2/queries/day-datas'
import { getSushiV3DayDatas } from 'src/subgraphs/sushi-v3/queries/day-datas'
import {
  SUSHISWAP_V2_SUPPORTED_CHAIN_IDS,
  SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  type SushiSwapV2ChainId,
  type SushiSwapV3ChainId,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/config'

export type GetSushiDayDatas = {} & ChainIdsVariable<
  SushiSwapV2ChainId | SushiSwapV3ChainId
>

export async function getSushiDayDatas({
  chainIds = Array.from(
    new Set([
      ...SUSHISWAP_V2_SUPPORTED_CHAIN_IDS,
      ...SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
    ]),
  ),
}: GetSushiDayDatas) {
  const sushiSwapV2ChainIds = chainIds.filter(isSushiSwapV2ChainId)
  const v2p = fetchMultichain({
    chainIds: sushiSwapV2ChainIds,
    fetch: getSushiV2DayDatas,
    variables: {
      first: Infinity,
    },
  })

  const sushiSwapV3ChainIds = chainIds.filter(isSushiSwapV3ChainId)
  const v3p = fetchMultichain({
    chainIds: sushiSwapV3ChainIds,
    fetch: getSushiV3DayDatas,
    variables: {
      first: Infinity,
    },
  })

  const [
    { data: sushiSwapV2DayDatas, errors: sushiSwapV2DayDataErrors },
    { data: sushiSwapV3DayDatas, errors: sushiSwapV3DayDatasErrors },
  ] = await Promise.all([v2p, v3p])

  const data = sushiSwapV3DayDatas
  sushiSwapV2DayDatas.forEach((dayData) => {
    data.push({
      id: dayData.id,
      date: dayData.date,
      volumeUSD: dayData.dailyVolumeUSD,
      volumeUSDUntracked: dayData.dailyVolumeUntracked,
      volumeETH: dayData.dailyVolumeETH,
      tvlUSD: dayData.totalLiquidityUSD,
      txCount: dayData.txCount,
      feesUSD: '0',
    })
  })

  const errors = [...sushiSwapV2DayDataErrors, ...sushiSwapV3DayDatasErrors]

  return { data, errors }
}
