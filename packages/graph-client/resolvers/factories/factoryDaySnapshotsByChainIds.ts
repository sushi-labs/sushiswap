import { ChainId, chainName, chainShortName } from 'sushi/chain'
import {
  isSushiSwapChain,
  isSushiSwapV3Chain,
  isTridentChain,
  SUBGRAPH_HOST,
  SUSHISWAP_SUBGRAPH_NAME,
  SUSHISWAP_V3_SUBGRAPH_NAME,
  SushiSwapV3ChainId,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import {
  FactoryDaySnapshot,
  getBuiltGraphSDK,
  Query,
  QueryResolvers,
  SushiSwapV3DayDatasQuery,
} from '../../.graphclient/index.js'

const transformV3DayToSnapshot = (
  days: SushiSwapV3DayDatasQuery['uniswapDayDatas'],
  chainId: number
): Query['factoryDaySnapshotsByChainIds'] =>
  days.map((day) => ({
    chainId: chainId,
    id: day.id,
    date: day.date,
    volumeNative: day.volumeETH,
    volumeUSD: day.volumeUSD,
    untrackedVolumeUSD: day.volumeUSDUntracked,
    liquidityNative: 0,
    liquidityUSD: day.tvlUSD,
    feesNative: 0,
    feesUSD: day.feesUSD,
    transactionCount: day.txCount,
    factory: null,
  }))

export const factoryDaySnapshotsByChainIds: QueryResolvers['factoryDaySnapshotsByChainIds'] = async (
  root,
  args,
  context,
  info
): Promise<Query['factoryDaySnapshotsByChainIds']> => {
  const fetchTridentSnapshots = async (chainId: number) => {
    const snapshots: FactoryDaySnapshot[] = await context.Trident.Query.factoryDaySnapshots({
      root,
      args,
      context: {
        ...context,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        subgraphName: TRIDENT_SUBGRAPH_NAME[chainId],
        subgraphHost: SUBGRAPH_HOST[chainId],
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

  const fetchSushiSwapV2Snapshots = async (chainId: number) => {
    const snapshots: FactoryDaySnapshot[] = await context.SushiSwap.Query.factoryDaySnapshots({
      root,
      args,
      context: {
        ...context,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
        subgraphHost: SUBGRAPH_HOST[chainId],
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
      subgraphName: SUSHISWAP_V3_SUBGRAPH_NAME[chainId],
      subgraphHost: SUBGRAPH_HOST[chainId],
    })

    const { uniswapDayDatas } = await sdk.SushiSwapV3DayDatas({
      first: args.first,
      skip: args.skip,
      orderBy: args.orderBy === 'liquidityUSD' ? 'tvlUSD' : 'date',
      orderDirection: args.orderDirection,
    })

    return transformV3DayToSnapshot(uniswapDayDatas, chainId)
  }

  const queries = args.chainIds.flatMap((chainId: ChainId) => {
    const queries: Promise<Query['factoryDaySnapshotsByChainIds']>[] = []

    if (isTridentChain(chainId)) {
      queries.push(fetchTridentSnapshots(chainId))
    }

    if (isSushiSwapChain(chainId)) {
      queries.push(fetchSushiSwapV2Snapshots(chainId))
    }

    if (isSushiSwapV3Chain(chainId)) {
      queries.push(fetchSushiSwapV3Snapshots(chainId))
    }

    return queries
  })

  return Promise.all(queries).then((snapshots) => snapshots.flat())
}
