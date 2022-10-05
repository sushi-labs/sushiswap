import { ChainId, chainName, chainShortName } from '@sushiswap/chain'
import {
  MASTERCHEF_V1_SUBGRAPH_NAME,
  MASTERCHEF_V2_SUBGRAPH_NAME,
  MINICHEF_SUBGRAPH_NAME,
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { getBuiltGraphSDK, InputMaybe, Pagination, Pair, Resolvers } from '../.graphclient'
import { getTokenBalances } from '../fetchers/token'

// TODO: MOVE
const page = <T extends Array<unknown>>(data: T, pagination: InputMaybe<Pagination | undefined>): T => {
  if (!pagination || pagination.pageIndex === undefined || pagination.pageSize === undefined) return data
  const start = pagination.pageIndex * pagination.pageSize
  const end = (pagination.pageIndex + 1) * pagination.pageSize
  return data.slice(start, end) as T
}

export const resolvers: Resolvers = {
  Bundle: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Factory: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  FactoryDaySnapshot: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
    chainShortName: (root, args, context, info) => root.chainShortName || context.chainShortName || 'eth',
  },
  Pair: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
    chainShortName: (root, args, context, info) => root.chainShortName || context.chainShortName || 'eth',
    volume1d: (root, args, context, info) => root.volume1d || '0',
    volume7d: (root, args, context, info) => root.volume7d || '0',
    fees1d: (root, args, context, info) => root.fees1d || '0',
    fees1w: (root, args, context, info) => root.fees1w || '0',
  },
  Query: {
    crossChainBundles: async (root, args, context, info) => {
      return Promise.all([
        ...args.chainIds
          .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.Trident.Query.bundles({
              root,
              args,
              context: {
                ...context,
                chainId,
                subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
                subgraphHost: SUBGRAPH_HOST[chainId],
              },
              info,
            }).then((bundles) =>
              bundles?.length > 0
                ? bundles.map((bundle) => ({
                    ...bundle,
                    chainId,
                  }))
                : []
            )
          ),
        ...args.chainIds
          .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.SushiSwap.Query.bundles({
              root,
              args,
              context: {
                ...context,
                chainId,
                subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
                subgraphHost: SUBGRAPH_HOST[chainId],
              },
              info,
            }).then((bundles) =>
              bundles?.length > 0
                ? bundles.map((bundle) => ({
                    ...bundle,
                    chainId,
                  }))
                : []
            )
          ),
      ]).then((bundles) => bundles.flat())
    },
    crossChainFactories: async (root, args, context, info) => {
      return Promise.all([
        ...args.chainIds
          .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.Trident.Query.factories({
              root,
              args,
              context: {
                ...context,
                chainId,
                subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
                subgraphHost: SUBGRAPH_HOST[chainId],
              },
              info,
            }).then((factories) => {
              return factories?.length > 0
                ? factories.map((factory) => ({
                    ...factory,
                    chainId,
                  }))
                : []
            })
          ),
        ...args.chainIds
          .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.SushiSwap.Query.factories({
              root,
              args,
              context: {
                ...context,
                chainId,
                subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
                subgraphHost: SUBGRAPH_HOST[chainId],
              },
              info,
            }).then((factories) => {
              return factories?.length > 0
                ? factories.map((factory) => ({
                    ...factory,
                    chainId,
                  }))
                : []
            })
          ),
      ]).then((factories) => factories.flat())
    },
    crossChainFactoryDaySnapshots: async (root, args, context, info) =>
      Promise.all([
        ...args.chainIds
          .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.Trident.Query.factoryDaySnapshots({
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
            }).then((snapshots) => {
              return snapshots.map((snapshot) => ({
                ...snapshot,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
              }))
            })
          ),
        ...args.chainIds
          .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.SushiSwap.Query.factoryDaySnapshots({
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
            }).then((snapshots) => {
              if (!Array.isArray(snapshots)) {
                // console.log({ snapshots })
              }
              return snapshots.map((snapshot) => ({
                ...snapshot,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
              }))
            })
          ),
      ]).then((snapshots) => snapshots.flat()),
    crossChainPairs: async (root, args, context, info) => {
      const transformer = (pools: Pair[], oneDayPools: Pair[], oneWeekPools: Pair[], farms: any, chainId) => {
        const blacklist = ['0xd5c5e3ca5f162165a6eff096156ec70f77f3a491']
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
                  farm?.incentives?.reduce(
                    (previousValue, currentValue) => previousValue + Number(currentValue.apr),
                    0
                  ) ?? 0
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
    },
    crossChainPair: async (root, args, context, info) => {
      const farms = await fetch('https://farm.sushi.com/v0').then((res) => res.json())

      // TODO: Optimise...
      // return fetch('https://farm.sushi.com/v0').then((res) => res.json()).then(farms => {
      //   return Promise.all([
      //     context.SushiSwap.Query.pair({
      //       root,
      //       args,
      //       context: {
      //         ...context,
      //         now: args.now,
      //         chainId: args.chainId,
      //         chainName: chainName[args.chainId],
      //         chainShortName: chainShortName[args.chainId],
      //         subgraphName: SUSHISWAP_SUBGRAPH_NAME[args.chainId],
      //         subgraphHost: SUBGRAPH_HOST[args.chainId],
      //       },
      //       info,
      //     }),
      //   ])
      // })

      const pool = SUSHISWAP_ENABLED_NETWORKS.includes(args.chainId)
        ? await context.SushiSwap.Query.pair({
            root,
            args,
            context: {
              ...context,
              now: args.now,
              chainId: args.chainId,
              chainName: chainName[args.chainId],
              chainShortName: chainShortName[args.chainId],
              subgraphName: SUSHISWAP_SUBGRAPH_NAME[args.chainId],
              subgraphHost: SUBGRAPH_HOST[args.chainId],
            },
            info,
          })
        : await context.Trident.Query.pair({
            root,
            args,
            context: {
              ...context,
              now: args.now,
              chainId: args.chainId,
              chainName: chainName[args.chainId],
              chainShortName: chainShortName[args.chainId],
              subgraphName: TRIDENT_SUBGRAPH_NAME[args.chainId],
              subgraphHost: SUBGRAPH_HOST[args.chainId],
            },
            info,
          })

      if (!pool) return

      const volume7d = pool.daySnapshots
        ?.slice(0, 6)
        ?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.volumeUSD), 0)
      const farm = farms?.[args.chainId]?.farms?.[pool.id]
      const feeApr = pool?.apr
      const incentiveApr =
        farm?.incentives?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.apr), 0) ?? 0
      const apr = Number(feeApr) + Number(incentiveApr)
      return {
        ...pool,
        id: `${chainShortName[args.chainId]}:${pool.id}`,
        chainId: args.chainId,
        chainName: chainName[args.chainId],
        chainShortName: chainShortName[args.chainId],
        volume7d,
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
    },
    crossChainTokens: async (root, args, context, info) => {
      return Promise.all([
        ...args.chainIds
          .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.Trident.Query.tokens({
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
            }).then((tokens) => {
              return tokens?.length > 0
                ? tokens.map((token) => ({
                    ...token,
                    id: `${chainShortName[chainId]}:${token.id}`,
                    chainId,
                    chainName: chainName[chainId],
                    chainShortName: chainShortName[chainId],
                  }))
                : []
            })
          ),
        ...args.chainIds
          .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.SushiSwap.Query.tokens({
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
            }).then((tokens) => {
              return tokens?.length > 0
                ? tokens.map((token) => ({
                    ...token,
                    id: `${chainShortName[chainId]}:${token.id}`,
                    chainId,
                    chainName: chainName[chainId],
                    chainShortName: chainShortName[chainId],
                  }))
                : []
            })
          ),
      ])
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
    },
    crossChainToken: async (root, args, context, info) => {
      const farms = await fetch('https://farm.sushi.com/v0').then((res) => res.json())

      const token = SUSHISWAP_ENABLED_NETWORKS.includes(args.chainId)
        ? await context.SushiSwap.Query.token({
            root,
            args,
            context: {
              ...context,
              now: args.now,
              chainId: args.chainId,
              chainName: chainName[args.chainId],
              chainShortName: chainShortName[args.chainId],
              subgraphName: SUSHISWAP_SUBGRAPH_NAME[args.chainId],
              subgraphHost: SUBGRAPH_HOST[args.chainId],
            },
            info,
          })
        : await context.Trident.Query.token({
            root,
            args,
            context: {
              ...context,
              now: args.now,
              chainId: args.chainId,
              chainName: chainName[args.chainId],
              chainShortName: chainShortName[args.chainId],
              subgraphName: TRIDENT_SUBGRAPH_NAME[args.chainId],
              subgraphHost: SUBGRAPH_HOST[args.chainId],
            },
            info,
          })

      return {
        ...token,
        id: `${chainShortName[args.chainId]}:${token.id}`,
        chainId: args.chainId,
        chainName: chainName[args.chainId],
        chainShortName: chainShortName[args.chainId],
        pairs: token.pairs
          ? token.pairs.map(({ pair }) => {
              const volume7d = pair.daySnapshots
                ?.slice(0, 6)
                ?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.volumeUSD), 0)
              const farm = farms?.[args.chainId]?.farms?.[pair.id]
              const feeApr = pair?.apr
              const incentiveApr =
                farm?.incentives?.reduce(
                  (previousValue, currentValue) => previousValue + Number(currentValue.apr),
                  0
                ) ?? 0
              const apr = Number(feeApr) + Number(incentiveApr)

              return {
                pair: {
                  ...pair,
                  volume7d,
                  id: `${chainShortName[args.chainId]}:${pair.id}`,
                  chainId: args.chainId,
                  chainName: chainName[args.chainId],
                  chainShortName: chainShortName[args.chainId],
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
                },
              }
            })
          : [],
      }
    },
    crossChainUser: async (root, args, context, info) => {
      const farms = await fetch('https://farm.sushi.com/v0').then((res) => res.json())

      const transformer = (user, chainId) => {
        return {
          ...user,
          id: args.id,
          chainId,
          chainName: chainName[chainId],
          liquidityPositions:
            user?.liquidityPositions?.length > 0
              ? user.liquidityPositions.map((el) => {
                  const volume7d = el.pair.daySnapshots
                    ?.slice(0, 6)
                    ?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.volumeUSD), 0)
                  const farm = farms?.[chainId]?.farms?.[el.pair.id]
                  const feeApr =
                    Number(el.pair?.liquidityUSD) > 5000
                      ? chainId === 1
                        ? el.pair?.apr / 100_000
                        : el.pair?.apr / 100
                      : 0

                  const incentiveApr =
                    farm?.incentives?.reduce(
                      (previousValue, currentValue) => previousValue + Number(currentValue.apr),
                      0
                    ) ?? 0
                  const apr = Number(feeApr) + Number(incentiveApr)
                  return {
                    ...el,
                    balance: Math.floor(Number(el.balance / 2)),
                    pair: {
                      ...el.pair,
                      volume7d,
                      id: `${chainShortName[chainId]}:${el.pair.id}`,
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
                    },
                  }
                })
              : [],
        }
      }

      return Promise.all([
        ...args.chainIds
          .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.SushiSwap.Query.user({
              root,
              args,
              context: {
                ...context,
                chainId,
                chainName: chainName[chainId],
                subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
                subgraphHost: SUBGRAPH_HOST[chainId],
              },
              info,
            }).then((user) => transformer(user, chainId))
          ),
        ...args.chainIds
          .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.Trident.Query.user({
              root,
              args,
              context: {
                ...context,
                chainId,
                chainName: chainName[chainId],
                subgraphName: TRIDENT_SUBGRAPH_NAME[chainId],
                subgraphHost: SUBGRAPH_HOST[chainId],
              },
              info,
            }).then((user) => transformer(user, chainId))
          ),
      ]).then((users) => {
        return users.flat().reduce(
          (acc, cur) => {
            return {
              ...acc,
              liquidityPositions: [...acc.liquidityPositions, ...cur.liquidityPositions],
            }
          },
          { liquidityPositions: [] }
        )
      })
    },
    crossChainChefUser: async (root, args, context, info) => {
      const fetcher = async ({
        chainId,
        subgraphName,
        subgraphHost,
      }: {
        chainId: ChainId
        subgraphName: string
        subgraphHost: string
      }) => {
        const sdk = getBuiltGraphSDK({ subgraphHost, subgraphName, chainId })

        return sdk
          .ChefUser({
            where: args.where,
            block: args.block,
          })
          .then(({ users }) => {
            return users.map((user) => ({
              ...user,
              chainId,
              chainName: chainName[chainId],
            }))
          })
      }

      return Promise.all([
        ...(args.chainIds.includes(ChainId.ETHEREUM)
          ? [MASTERCHEF_V1_SUBGRAPH_NAME, MASTERCHEF_V2_SUBGRAPH_NAME].map((subgraphName) =>
              fetcher({ chainId: ChainId.ETHEREUM, subgraphName, subgraphHost: SUBGRAPH_HOST[ChainId.ETHEREUM] })
            )
          : []),
        ...args.chainIds
          .filter((el) => [...Object.keys(MINICHEF_SUBGRAPH_NAME)].includes(String(el)))
          .map((chainId) =>
            fetcher({ chainId, subgraphName: MINICHEF_SUBGRAPH_NAME[chainId], subgraphHost: SUBGRAPH_HOST[chainId] })
          ),
      ]).then((users) => users.flat())
    },
    crossChainUserWithFarms: async (root, args, context, info) => {
      const sdk = getBuiltGraphSDK()

      // ugly but good for performance because of the pair fetch
      const [unstakedPools, stakedPools] = await Promise.all([
        sdk
          .CrossChainUser({ id: args.id, where: { balance_gt: 0 }, chainIds: args.chainIds, now: 0 })
          .then(async ({ crossChainUser: user }) => {
            const balances = await getTokenBalances(
              (user.liquidityPositions ?? []).map((lp) => ({
                token: lp.pair.id.split(':')[1],
                user: args.id,
                chainId: lp.pair.chainId,
              }))
            )

            return (user.liquidityPositions ?? [])
              .map((lp) => ({
                id: lp.pair.id,
                unstakedBalance: balances.find((el) => el.token === lp.pair.id.split(':')[1])?.balance ?? '0',
                stakedBalance: '0',
                pair: lp.pair,
                chainId: lp.pair.chainId,
                chainName: lp.pair.chainName,
              }))
              .filter((entry) => entry.unstakedBalance !== '0')
          }),

        sdk
          .CrossChainChefUser({ where: { address: args.id, amount_gt: 0 }, chainIds: args.chainIds })
          .then(async ({ crossChainChefUser }) => {
            // TODO?: move pair fetch to crossChainChefUser resolver
            const stakedPairs = (
              await Promise.all(
                crossChainChefUser.map(({ chainId, pool }) =>
                  sdk
                    .CrossChainPair({ id: (pool as { pair: string }).pair, chainId, now: 0 })
                    .then(({ crossChainPair: pair }) => pair)
                )
              )
            ).filter((pair) => !(pair && pair.chainId === ChainId.POLYGON && pair.source === 'LEGACY'))
            // TODO: remove when polygon subgraph is synced

            return crossChainChefUser
              .map((user) => {
                const pair = stakedPairs.find((stakedPair) => stakedPair?.id?.split(':')[1] === user.pool?.pair)

                if (!pair) return

                return {
                  id: pair.id,
                  unstakedBalance: '0',
                  stakedBalance: String(user.amount),
                  pair: pair,
                  chainId: user.chainId,
                  chainName: user.chainName,
                }
              })
              .filter((user): user is NonNullable<typeof user> => !!user && !!user.pair.id)
          }),
      ])

      const allPairIds = Array.from(new Set([...unstakedPools, ...stakedPools].map((el) => el.id)))

      // console.log({ allPairIds })

      return allPairIds.reduce((acc, cur) => {
        const unstaked = unstakedPools.find((el) => el.id === cur)
        const staked = stakedPools.find((el) => el.id === cur)
        const combined = staked
          ? unstaked
            ? { ...unstaked, stakedBalance: staked.stakedBalance }
            : staked
          : (unstaked as NonNullable<typeof unstaked>)

        const pair = unstaked?.pair ?? (staked as NonNullable<typeof unstaked>).pair

        const totalBalance = Number(unstaked?.unstakedBalance ?? 0) + Number(staked?.stakedBalance ?? 0)
        const valueUSD = (totalBalance / pair.liquidity) * pair.liquidityUSD

        acc.push({ ...combined, valueUSD })
        return acc
      }, [] as any[])
    },
  },
}
