import { chainName, chainShortName } from '@sushiswap/chain'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { Pair, QueryResolvers } from '../../.graphclient'
import { page } from './../../functions'

const blacklist = ['0xd5c5e3ca5f162165a6eff096156ec70f77f3a491']

export const crossChainPairs: QueryResolvers['crossChainPairs'] = async (root, args, context, info) => {
  const transformer = (pools: Pair[], oneDayPools: Pair[], oneWeekPools: Pair[], farms: any, chainId) => {
    return pools?.length > 0
      ? pools
          .filter((pool) => !blacklist.includes(pool.id))
          .map((pool) => {
            const pool1d = Array.isArray(oneDayPools)
              ? oneDayPools?.find((oneDayPool) => oneDayPool.id === pool.id)
              : undefined
            const pool1w = Array.isArray(oneWeekPools)
              ? oneWeekPools?.find((oneWeekPool) => oneWeekPool.id === pool.id)
              : undefined
            const volume1w = pool1w ? Number(pool.volumeUSD) - Number(pool1w.volumeUSD) : 0
            const volume1d = pool1d ? Number(pool.volumeUSD) - Number(pool1d.volumeUSD) : 0
            const fees1w = pool1w ? Number(pool.feesUSD) - Number(pool1w.feesUSD) : 0
            const fees1d = pool1d ? Number(pool.feesUSD) - Number(pool1d.feesUSD) : 0
            const farm = farms?.[chainId]?.farms?.[pool.id.toLowerCase()]
            const feeApr = pool?.apr
            const incentiveApr =
              farm?.incentives?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.apr), 0) ??
              0
            const apr = Number(feeApr) + Number(incentiveApr)
            return {
              ...pool,
              volume1d,
              volume1w,
              fees1w,
              fees1d,
              id: `${chainShortName[chainId]}:${pool.id}`,
              chainId,
              chainName: chainName[chainId],
              chainShortName: chainShortName[chainId],
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
          })
      : []
  }

  return fetch('https://farm.sushi.com/v0')
    .then((data) => data.json())
    .then((farms) =>
      Promise.all([
        ...args.chainIds
          .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
          .map((chainId) => {
            return context.Trident.Query.pairs({
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
            }).then((pools) =>
              Promise.all([
                Promise.resolve(pools),
                context.Trident.Query.pairs({
                  root,
                  args: {
                    ...args,
                    first: pools.length,
                    where: { id_in: pools.map((pool) => pool.id) },
                    block: { number: Number(args.oneDayBlockNumbers[args.chainIds.indexOf(chainId)]) },
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
                }),
                context.Trident.Query.pairs({
                  root,
                  args: {
                    ...args,
                    first: pools.length,
                    where: { id_in: pools.map((pool) => pool.id) },
                    block: { number: Number(args.oneWeekBlockNumbers[args.chainIds.indexOf(chainId)]) },
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
                }),
              ]).then(([pools, oneDayPools, oneWeekPools]) => {
                // console.log('BEFORE TRANSFORMER 1', { pools, oneDayPools, oneWeekPools })
                return transformer(pools, oneDayPools, oneWeekPools, farms, chainId)
              })
            )
          }),
        ...args.chainIds
          .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
          .map((chainId) => {
            return context.SushiSwap.Query.pairs({
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
              .then((pools) => {
                // If no farms, resolve pools and one day pools
                if (!farms?.[chainId]?.farms) {
                  return Promise.all([
                    Promise.resolve(pools),
                    context.SushiSwap.Query.pairs({
                      root,
                      args: {
                        ...args,
                        first: pools.length,
                        where: {
                          id_in: pools.map((pool) => pool.id),
                        },
                        block: { number: Number(args.oneDayBlockNumbers[args.chainIds.indexOf(chainId)]) },
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
                    }),
                  ])
                }
                const poolIds = Array.from(
                  new Set([...pools.map((pool) => pool.id), ...Object.keys(farms?.[chainId]?.farms)])
                )
                return Promise.all([
                  context.SushiSwap.Query.pairs({
                    root,
                    args: {
                      ...args,
                      first: poolIds.length,
                      // need the name_contains for filtering, since we're adding farms to the query
                      where: { id_in: poolIds, name_contains_nocase: args.where?.name_contains_nocase },
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
                  }),
                  context.SushiSwap.Query.pairs({
                    root,
                    args: {
                      ...args,
                      first: poolIds.length,
                      where: { id_in: poolIds, name_contains_nocase: args.where?.name_contains_nocase },
                      block: { number: Number(args.oneDayBlockNumbers[args.chainIds.indexOf(chainId)]) },
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
                  }),
                  context.SushiSwap.Query.pairs({
                    root,
                    args: {
                      ...args,
                      first: poolIds.length,
                      where: { id_in: poolIds, name_contains_nocase: args.where?.name_contains_nocase },
                      block: { number: Number(args.oneWeekBlockNumbers[args.chainIds.indexOf(chainId)]) },
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
                  }),
                ])
              })
              .then(([pools, oneDayPools, oneWeekPools]) => {
                return transformer(pools, oneDayPools, oneWeekPools, farms, chainId)
              })
          }),
      ])
    )
    .then((pools) =>
      pools.flat().sort((a, b) => {
        if (args.orderDirection === 'asc') {
          return a[args.orderBy || 'apr'] - b[args.orderBy || 'apr']
        } else if (args.orderDirection === 'desc') {
          return b[args.orderBy || 'apr'] - a[args.orderBy || 'apr']
        }
        return 0
      })
    )
    .then((pools) => page(pools, args.pagination))
}
