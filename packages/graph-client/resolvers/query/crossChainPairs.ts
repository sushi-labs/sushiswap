import { chainName, chainShortName } from '@sushiswap/chain'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { Pair, QueryResolvers } from '../../.graphclient'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types'
import { getOneDayBlocks, getOneWeekBlocks } from '../../fetchers/block'
import { FarmAPI, getFarms } from '../../fetchers/farms'
import { page } from './../../functions'

const blacklist = ['0xd5c5e3ca5f162165a6eff096156ec70f77f3a491']

interface SushiPairWithChain extends SushiSwapTypes.Pair {
  chainId: number
}

const transformer = (
  pools: SushiPairWithChain[],
  pools1d: SushiPairWithChain[],
  pools1w: SushiPairWithChain[],
  farms: FarmAPI,
  farmsOnly?: boolean
): Pair[] =>
  (pools || [])
    .filter((pool) => !blacklist.includes(pool.id))
    .filter((pool) =>
      farmsOnly
        ? farms?.[pool.chainId]?.farms?.[pool.id.toLowerCase()]?.incentives?.reduce(
            (previousValue, currentValue) => previousValue + Number(currentValue.apr),
            0
          ) > 0
        : true
    )
    .map((pool) => {
      const pool1d = Array.isArray(pools1d) ? pools1d?.find((oneDayPool) => oneDayPool.id === pool.id) : undefined
      const pool1w = Array.isArray(pools1w) ? pools1w?.find((oneWeekPool) => oneWeekPool.id === pool.id) : undefined
      const volume1w = pool1w ? Number(pool.volumeUSD) - Number(pool1w.volumeUSD) : 0
      const volume1d = pool1d ? Number(pool.volumeUSD) - Number(pool1d.volumeUSD) : 0
      const fees1w = pool1w ? Number(pool.feesUSD) - Number(pool1w.feesUSD) : 0
      const fees1d = pool1d ? Number(pool.feesUSD) - Number(pool1d.feesUSD) : 0
      const farm = farms?.[pool.chainId]?.farms?.[pool.id.toLowerCase()]
      const feeApr = pool?.apr
      const incentiveApr =
        farm?.incentives?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.apr), 0) ?? 0
      const apr = Number(feeApr) + Number(incentiveApr)
      return {
        ...pool,
        volume1d,
        volume1w,
        fees1w,
        fees1d,
        id: `${chainShortName[pool.chainId]}:${pool.id}`,
        chainId: pool.chainId,
        chainName: chainName[pool.chainId],
        chainShortName: chainShortName[pool.chainId],
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
      }
      // TODO!: Fix the type, will need an overhaul of the whole thing
    }) as any

export const crossChainPairs: QueryResolvers['crossChainPairs'] = async (root, args, context, info) => {
  const fetcher = async ({ blocks, poolIds }: { blocks?: { number: number }[]; poolIds?: string[] } = {}) => {
    const tridentPools = Promise.all(
      args.chainIds
        .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
        .map(async (chainId) => {
          const pools: SushiSwapTypes.Pair[] | undefined = await context.Trident.Query.pairs({
            root,
            args: {
              ...args,
              where: {
                ...args.where,
                id_in: poolIds,
              },
              first: poolIds ? (poolIds.length > 1000 ? 1000 : poolIds.length) : undefined,
              block: blocks?.[args.chainIds.indexOf(chainId)],
            },
            context: {
              ...context,
              chainId,
              chainName: chainName[chainId],
              chainShortName: chainShortName[chainId],
              subgraphName: TRIDENT_SUBGRAPH_NAME[chainId],
              subgraphHost: SUBGRAPH_HOST[chainId],
            },
            info,
            // Should be TridentTypes.Pair[], but the schemas are identical and it'd cause a bit of a mess
          }) //.then((pools) => (pools || []).map((pool) => ({ ...pool, chainId })))

          if (!Array.isArray(pools)) return []

          return pools.map((pool) => ({ ...pool, chainId }))
        })
    )

    const where = { ...args.where }
    if (where.type_in) {
      where.type_in = where.type_in.filter((el) => el === 'CONSTANT_PRODUCT_POOL')
    }

    const sushiswapPools = Promise.all(
      args.chainIds
        .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
        .map(async (chainId) => {
          const pools: SushiSwapTypes.Pair[] = await context.SushiSwap.Query.pairs({
            root,
            args: {
              ...args,
              where: {
                ...where,
                id_in: poolIds,
              },
              // no idea why, even with autoPagination it just blows up for no reason
              first: poolIds ? (poolIds.length > 1000 ? 1000 : poolIds.length) : undefined,
              block: blocks?.[args.chainIds.indexOf(chainId)],
            },
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

          if (!Array.isArray(pools)) return []

          return pools.map((pool) => ({ ...pool, chainId }))
        })
    )

    const pools = await Promise.all([tridentPools, sushiswapPools])
    return pools.flat(2)
  }

  // Blocks are an ordered array, index of a specific block corresponds to a specific chainId index
  const [pools, farms, oneDayBlocks, oneWeekBlocks] = await Promise.all([
    fetcher(),
    getFarms(),
    getOneDayBlocks(args.chainIds),
    getOneWeekBlocks(args.chainIds),
  ])

  const farmPoolIds = Object.values(farms)
    .flatMap(({ farms }) => Object.keys(farms)) // lp token addys
    .filter((lpToken) => !pools.map(({ id }) => id).includes(lpToken)) // only unfetched

  // Fetching farmPools just to be sure they weren't missed
  const [farmPools, pools1d, pools1w] = await Promise.all([
    fetcher({ poolIds: farmPoolIds }),
    fetcher({ blocks: oneDayBlocks, poolIds: pools.map(({ id }) => id) }),
    fetcher({ blocks: oneWeekBlocks, poolIds: pools.map(({ id }) => id) }),
  ])

  const allPools = [...pools, ...farmPools]

  const transformed = transformer(allPools, pools1d, pools1w, farms, args?.farmsOnly)

  return page(
    transformed.sort((a, b) => {
      if (args.orderDirection === 'asc') {
        return a[args.orderBy || 'apr'] - b[args.orderBy || 'apr']
      } else if (args.orderDirection === 'desc') {
        return b[args.orderBy || 'apr'] - a[args.orderBy || 'apr']
      }
      return 0
    }),
    args.pagination
  )
}
