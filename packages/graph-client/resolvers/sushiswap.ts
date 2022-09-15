import { chainName, chainShortName } from '@sushiswap/chain'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { InputMaybe, Pagination, Pair, Resolvers } from '../.graphclient'

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
                console.log({ snapshots })
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
        return pools?.length > 0
          ? pools.map((pool) => {
              const pool1d = oneDayPools?.find((oneDayPool) => oneDayPool.id === pool.id)
              const pool1w = oneWeekPools?.find((oneWeekPool) => oneWeekPool.id === pool.id)
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
                      feeApy: String(farm.feeApy),
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
                  ]).then(([pools, oneDayPools, oneWeekPools]) =>
                    transformer(pools, oneDayPools, oneWeekPools, farms, chainId)
                  )
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
                            where: { id_in: pools.map((pool) => pool.id) },
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
                          where: { id_in: poolIds },
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
                          where: { id_in: poolIds },
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
                          where: { id_in: poolIds },
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
                  .then(([pools, oneDayPools, oneWeekPools]) =>
                    transformer(pools, oneDayPools, oneWeekPools, farms, chainId)
                  )
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

      const pool = SUSHISWAP_ENABLED_NETWORKS.includes(args.chainId)
        ? await context.Exchange.Query.pair({
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
              feeApy: String(farm.feeApy),
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
                            feeApy: String(farm.feeApy),
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
  },
}
