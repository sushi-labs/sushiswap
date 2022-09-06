import { chainName, chainShortName } from '@sushiswap/chain'
import {
  AMM_ENABLED_NETWORKS,
  EXCHANGE_SUBGRAPH_NAME,
  GRAPH_HOST,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from 'config'

import { InputMaybe, Pagination, Resolvers } from '.graphclient'

const page = <T extends Array<unknown>>(data: T, pagination: InputMaybe<Pagination | undefined>): T => {
  if (!pagination || pagination.pageIndex === undefined || pagination.pageSize === undefined) return data

  const start = pagination.pageIndex * pagination.pageSize
  const end = (pagination.pageIndex + 1) * pagination.pageSize

  return data.slice(start, end) as T
}

export const resolvers: Resolvers = {
  Factory: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
    chainShortName: (root, args, context, info) => root.chainShortName || context.chainShortName || 'eth',
  },
  Pair: {
    volume7d: (root, args, context, info) => root.volume7d || '0',
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
    chainShortName: (root, args, context, info) => root.chainShortName || context.chainShortName || 'eth',
  },
  Bundle: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
  },
  // Farm: {
  //   chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
  //   chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
  // },
  Query: {
    crossChainPair: async (root, args, context, info) => {
      const farms = await fetch('https://farm.sushi.com/v0').then((res) => res.json())

      const pool = AMM_ENABLED_NETWORKS.includes(args.chainId)
        ? await context.Exchange.Query.pair({
            root,
            args,
            context: {
              ...context,
              now: args.now,
              chainId: args.chainId,
              chainName: chainName[args.chainId],
              chainShortName: chainShortName[args.chainId],
              subgraphName: EXCHANGE_SUBGRAPH_NAME[args.chainId],
              subgraphHost: GRAPH_HOST[args.chainId],
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
              subgraphHost: GRAPH_HOST[args.chainId],
            },
            info,
          })

      const volume7d = pool.daySnapshots
        ?.slice(0, 6)
        ?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.volumeUSD), 0)
      const farm = farms?.[args.chainId]?.farms?.[pool.id]
      // console.log(`Farm for pool ${pool.id}`, farm)
      const feeApr =
        Number(pool?.liquidityUSD) > 5000 ? (args.chainId === 1 ? pool?.apr / 100_000 : pool?.apr / 100) : 0
      const incentiveApr =
        farm?.incentives?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.apr), 0) ?? 0
      const apr = Number(feeApr) + Number(incentiveApr)

      if (feeApr > 0 && incentiveApr > 0) {
        console.log({ feeApr, incentiveApr })
      }
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
    crossChainPairs: async (root, args, context, info) => {
      const farms = await fetch('https://farm.sushi.com/v0').then((res) => res.json())

      const transformer = (pools, chainId) => {
        return pools?.length > 0
          ? pools.map((pool) => {
              const volume7d = pool.daySnapshots
                ?.slice(0, 6)
                ?.reduce((previousValue, currentValue) => previousValue + Number(currentValue.volumeUSD), 0)
              const farm = farms?.[chainId]?.farms?.[pool.id]
              // console.log(`Farm for pool ${pool.id}`, farm)
              const feeApr =
                Number(pool?.liquidityUSD) > 5000 ? (chainId === 1 ? pool?.apr / 100_000 : pool?.apr / 100) : 0
              const incentiveApr =
                farm?.incentives?.reduce(
                  (previousValue, currentValue) => previousValue + Number(currentValue.apr),
                  0
                ) ?? 0
              const apr = Number(feeApr) + Number(incentiveApr)

              // if (feeApr > 0 && incentiveApr > 0) {
              //   console.log({ feeApr, incentiveApr })
              // }
              return {
                ...pool,
                volume7d,
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

      return Promise.all([
        ...args.chainIds
          .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.Trident.Query.pairs({
              root,
              args,
              context: {
                ...context,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
                subgraphName: TRIDENT_SUBGRAPH_NAME[chainId],
                subgraphHost: GRAPH_HOST[chainId],
              },
              info,
            }).then((pools) => transformer(pools, chainId))
          ),
        ...args.chainIds
          .filter((el) => AMM_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.Exchange.Query.pairs({
              root,
              args,
              context: {
                ...context,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
                subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
                subgraphHost: GRAPH_HOST[chainId],
              },
              info,
            }).then((pools) => transformer(pools, chainId))
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
                chainName: chainName[chainId],
                subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
                subgraphHost: GRAPH_HOST[chainId],
              },
              info,
            }).then((bundles) =>
              bundles?.length > 0
                ? bundles.map((bundle) => ({
                    ...bundle,
                    chainId,
                    chainName: chainName[chainId],
                  }))
                : []
            )
          ),
        ...args.chainIds
          .filter((el) => AMM_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.Exchange.Query.bundles({
              root,
              args,
              context: {
                ...context,
                chainId,
                chainName: chainName[chainId],
                subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
                subgraphHost: GRAPH_HOST[chainId],
              },
              info,
            }).then((bundles) =>
              bundles?.length > 0
                ? bundles.map((bundle) => ({
                    ...bundle,
                    chainId,
                    chainName: chainName[chainId],
                  }))
                : []
            )
          ),
      ]).then((bundles) => bundles.flat())
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
                  // console.log(`Farm for pool ${pool.id}`, farm)
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
          .filter((el) => AMM_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.Exchange.Query.user({
              root,
              args,
              context: {
                ...context,
                chainId,
                chainName: chainName[chainId],
                subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
                subgraphHost: GRAPH_HOST[chainId],
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
                subgraphHost: GRAPH_HOST[chainId],
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
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
                subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
                subgraphHost: GRAPH_HOST[chainId],
              },
              info,
            }).then((factories) => {
              return factories?.length > 0
                ? factories.map((factory) => ({
                    ...factory,
                    chainId,
                    chainName: chainName[chainId],
                    chainShortName: chainShortName[chainId],
                  }))
                : []
            })
          ),
        ...args.chainIds
          .filter((el) => AMM_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.Exchange.Query.factories({
              root,
              args,
              context: {
                ...context,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
                subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
                subgraphHost: GRAPH_HOST[chainId],
              },
              info,
            }).then((factories) => {
              return factories?.length > 0
                ? factories.map((factory) => ({
                    ...factory,
                    chainId,
                    chainName: chainName[chainId],
                    chainShortName: chainShortName[chainId],
                  }))
                : []
            })
          ),
      ]).then((snapshots) => snapshots.flat())
    },
  },
}
