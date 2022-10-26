import { chainName, chainShortName } from '@sushiswap/chain'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { Pair, QueryResolvers } from '../../../.graphclient'
import { SushiSwapTypes } from '../../../.graphclient/sources/SushiSwap/types'
import { FarmAPI } from '../../farm'
import { getOneDayBlocks, getOneWeekBlocks, getTwoDayBlocks } from '../../fetchers'

export const crossChainPair: QueryResolvers['crossChainPair'] = async (root, args, context, info) => {
  const farms: FarmAPI = await fetch('https://farm.sushi.com/v0').then((res) => res.json())

  const fetcher = async (block?: { number: number }) => {
    const pool = await Promise.allSettled<SushiSwapTypes.Pair[]>([
      SUSHISWAP_ENABLED_NETWORKS.includes(args.chainId)
        ? context.SushiSwap.Query.pair({
            root,
            args: { ...args, block },
            context: {
              ...context,
              now: args.now,
              chainId: args.chainId,
              chainName: chainName[args.chainId],
              chainShortName: chainShortName[args.chainId],
              subgraphName: SUSHISWAP_SUBGRAPH_NAME[args.chainId as typeof SUSHISWAP_ENABLED_NETWORKS[number]],
              subgraphHost: SUBGRAPH_HOST[args.chainId as typeof SUSHISWAP_ENABLED_NETWORKS[number]],
            },
            info,
          })
        : undefined,
      TRIDENT_ENABLED_NETWORKS.includes(args.chainId)
        ? context.Trident.Query.pair({
            root,
            args: { ...args, block },
            context: {
              ...context,
              now: args.now,
              chainId: args.chainId,
              chainName: chainName[args.chainId],
              chainShortName: chainShortName[args.chainId],
              subgraphName: TRIDENT_SUBGRAPH_NAME[args.chainId as typeof TRIDENT_ENABLED_NETWORKS[number]],
              subgraphHost: SUBGRAPH_HOST[args.chainId as typeof TRIDENT_ENABLED_NETWORKS[number]],
            },
            info,
          })
        : undefined,
    ]).then((results) => {
      return results.flat().map((result) => {
        if (result.status === 'fulfilled' && result.value) {
          return result.value
        }
      })
    })

    return pool.filter(Boolean).find(Boolean)
  }

  const [[oneDayBlock], [twoDayBlock], [oneWeekBlock]] = await Promise.all([
    getOneDayBlocks([args.chainId]),
    getTwoDayBlocks([args.chainId]),
    getOneWeekBlocks([args.chainId]),
  ])

  const [pool, pool1d, pool2d, pool1w] = await Promise.all([
    fetcher(),
    fetcher(oneDayBlock),
    fetcher(twoDayBlock),
    fetcher(oneWeekBlock),
  ])
  if (!pool) return null

  const liquidity1dChange = pool1d ? pool.liquidityUSD / pool1d.liquidityUSD - 1 : 0
  const liquidity1wChange = pool1w ? pool.liquidityUSD / pool1w.liquidityUSD - 1 : 0

  const volume1d = pool1d ? pool.volumeUSD - pool1d.volumeUSD : 0
  const volume2d = pool1d && pool2d ? pool1d.volumeUSD - pool2d.volumeUSD : 0

  const volume1dChange = pool2d ? volume1d / volume2d - 1 : null
  // if pool isn't 7 days old, use snapshots for at least some data
  const volume1w = pool1w
    ? Number(pool.volumeUSD) - Number(pool1w.volumeUSD)
    : pool.daySnapshots
        ?.slice(0, 6)
        ?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.volumeUSD), 0)

  const txCount1d = pool1d ? pool.txCount - pool1d.txCount : 0
  const txCount2d = pool1d && pool2d ? pool1d.txCount - pool2d.txCount : 0
  const txCount1dChange = pool2d ? txCount1d / txCount2d - 1 : null
  // if pool isn't 7 days old, use snapshots for at least some data
  const txCount1w = pool1w
    ? Number(pool.txCount) - Number(pool1w.txCount)
    : pool.daySnapshots
        ?.slice(0, 6)
        ?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.transactionCount), 0)

  const farm = farms?.[args.chainId]?.farms?.[pool.id]
  const incentiveApr =
    farm?.incentives?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.apr), 0) ?? 0

  const feeApr = pool.apr
  const apr = Number(feeApr) + Number(incentiveApr)

  return {
    ...pool,
    id: `${chainShortName[args.chainId]}:${pool.id}`,
    chainId: args.chainId,
    chainName: chainName[args.chainId],
    chainShortName: chainShortName[args.chainId],
    liquidity1dChange,
    liquidity1wChange,
    volume1d,
    volume1dChange,
    volume1w,
    txCount1d,
    txCount1dChange,
    txCount1w,
    apr: String(apr),
    feeApr: String(feeApr),
    incentiveApr: String(incentiveApr),
    farm: farm
      ? {
          id: farm.id,
          incentives: farm.incentives.map((incentive) => ({
            apr: String(incentive.apr),
            rewardPerDay: String(incentive.rewardPerDay),
            rewardToken: {
              address: incentive.rewardToken.address,
              symbol: incentive.rewardToken.symbol,
              decimals: Number(incentive.rewardToken.decimals),
            },
            rewarderAddress: incentive.rewarder.address,
            rewarderType: incentive.rewarder.type,
          })),
          chefType: String(farm.chefType),
          poolType: String(farm.poolType),
        }
      : null,
  } as Pair
}
