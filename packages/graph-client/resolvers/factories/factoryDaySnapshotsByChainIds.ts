import { ChainId, chainName, chainShortName } from 'sushi/chain'

import { isPromiseFulfilled } from 'sushi/validate'
import {
  Query,
  QueryResolvers,
  SushiSwapV3DayDatasQuery,
  UniswapDayData,
  getBuiltGraphSDK,
} from '../../.graphclient/index.js'
import {
  SUSHISWAP_V2_SUBGRAPH_URL,
  SUSHISWAP_V3_SUBGRAPH_URL,
} from 'sushi/config/subgraph'
import {
  SushiSwapV3ChainId,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/config'

const transformV3DayToSnapshot = (
  days: SushiSwapV3DayDatasQuery['uniswapDayDatas'],
  chainId: number,
): Query['factoryDaySnapshotsByChainIds'] =>
  days.map((day) => ({
    chainId: chainId,
    id: day.id,
    date: day.date,

    dailyVolumeUSD: day.volumeUSD,
    dailyVolumeUntracked: day.volumeUSDUntracked,
    dailyVolumeETH: day.volumeETH,

    totalLiquidityUSD: day.tvlUSD,
    totalVolumeUSD: 0,
    totalVolumeETH: 0,
    totalLiquidityETH: 0,
    txCount: day.txCount,
  }))

export const factoryDaySnapshotsByChainIds: QueryResolvers['factoryDaySnapshotsByChainIds'] =
  async (
    root,
    args,
    context,
    info,
  ): Promise<Query['factoryDaySnapshotsByChainIds']> => {
    const fetchSushiSwapV2Snapshots = async (chainId: number) => {
      const snapshots: UniswapDayData[] =
        await context.SushiSwapV2.Query.uniswapDayDatas({
          root,
          args,
          context: {
            ...context,
            chainId,
            chainName: chainName[chainId],
            chainShortName: chainShortName[chainId],
            url: SUSHISWAP_V2_SUBGRAPH_URL[chainId],
          },
          info,
        })

      return (
        snapshots?.map((snapshot) => ({
          ...snapshot,
          chainId,
          chainName: chainName[chainId],
          chainShortName: chainShortName[chainId],
        })) || []
      )
    }

    const fetchSushiSwapV3Snapshots = async (chainId: SushiSwapV3ChainId) => {
      const sdk = getBuiltGraphSDK({
        url: SUSHISWAP_V3_SUBGRAPH_URL[chainId],
      })

      const { uniswapDayDatas } = await sdk.SushiSwapV3DayDatas({
        first: args.first,
        skip: args.skip,
        orderBy: args.orderBy === 'totalLiquidityUSD' ? 'tvlUSD' : 'date',
        orderDirection: args.orderDirection,
      })
      return transformV3DayToSnapshot(uniswapDayDatas, chainId)
    }

    const queries = args.chainIds.flatMap((chainId: ChainId) => {
      const queries: Promise<Query['factoryDaySnapshotsByChainIds']>[] = []

      if (isSushiSwapV2ChainId(chainId)) {
        queries.push(fetchSushiSwapV2Snapshots(chainId))
      }

      if (isSushiSwapV3ChainId(chainId)) {
        queries.push(fetchSushiSwapV3Snapshots(chainId))
      }

      return queries
    })

    return Promise.allSettled(queries).then((snapshots) =>
      snapshots
        .filter(isPromiseFulfilled)
        .map((snapshot) => snapshot.value)
        .flat(),
    )
  }
