import { chainName, chainShortName } from '@sushiswap/chain'

import {
  AMM_ENABLED_NETWORKS,
  EXCHANGE_SUBGRAPH_NAME,
  GRAPH_HOST,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from './config'
import { InputMaybe, Pagination, Resolvers } from '.graphclient'

const page = <T extends Array<unknown>>(data: T, pagination: InputMaybe<Pagination | undefined>): T => {
  if (!pagination || pagination.pageIndex === undefined || pagination.pageSize === undefined) return data

  const start = pagination.pageIndex * pagination.pageSize
  const end = (pagination.pageIndex + 1) * pagination.pageSize

  return data.slice(start, end) as T
}

export const resolvers: Resolvers = {
  Pair: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
    chainShortName: (root, args, context, info) => root.chainShortName || context.chainShortName || 'eth',
    volume24h: (root, args, context, info) => root.volume24h || '0',
    fees24h: (root, args, context, info) => root.fees24h || '0',
    volume7d: (root, args, context, info) => root.volume7d || '0',
    fees7d: (root, args, context, info) => root.fees7d || '0',
  },
  Bundle: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
  },
  FactoryDaySnapshot: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
    chainShortName: (root, args, context, info) => root.chainShortName || context.chainShortName || 'eth',
  },
  Query: {
    crossChainPairs: async (root, args, context, info) => {
      const farms = await fetch('https://farm.sushi.com/v0').then((res) => res.json())

      const transformer = (pools, chainId) => {
        return pools?.length > 0
          ? pools.map((pool) => {
              const volume24h = Number(pool.hourSnapshots?.[0]?.volumeUSD)
              const fees24h = Number(pool.hourSnapshots?.[0]?.feesUSD)
              const volume7d = pool.daySnapshots?.reduce((previousValue, currentValue, i) => {
                if (i > 6) return previousValue
                return previousValue + Number(currentValue.volumeUSD)
              }, 0)
              const fees7d = pool.daySnapshots?.reduce((previousValue, currentValue, i) => {
                if (i > 6) return previousValue
                return previousValue + Number(currentValue.feesUSD)
              }, 0)
              const farm = farms?.[chainId]?.farms?.[pool.id.toLowerCase()]
              const feeApr =
                Number(pool?.liquidityUSD) > 5000 ? (chainId === 1 ? pool?.apr / 100_000 : pool?.apr / 100) : 0
              const incentiveApr =
                farm?.incentives?.reduce(
                  (previousValue, currentValue) => previousValue + Number(currentValue.apr),
                  0
                ) ?? 0
              const apr = Number(feeApr) + Number(incentiveApr)

              return {
                ...pool,
                volume7d,
                volume24h,
                fees24h,
                fees7d,
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
                subgraphHost: GRAPH_HOST[chainId],
              },
              info,
            }).then((pools) => transformer(pools, chainId))
          }),
        ...args.chainIds
          .filter((el) => AMM_ENABLED_NETWORKS.includes(el))
          .map((chainId) => {
            return context.Exchange.Query.pairs({
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
            })
              .then((pools) => {
                if (!farms?.[chainId]?.farms) return pools
                const ids = Array.from(
                  new Set([...pools.map((pool) => pool.id), ...Object.keys(farms?.[chainId]?.farms)])
                )
                return context.Exchange.Query.pairs({
                  root,
                  args: {
                    first: ids.length,
                    where: {
                      id_in: Array.from(
                        new Set([...pools.map((pool) => pool.id), ...Object.keys(farms?.[chainId]?.farms)])
                      ),
                    },
                  },
                  context: {
                    ...context,
                    chainId,
                    chainName: chainName[chainId],
                    chainShortName: chainShortName[chainId],
                    subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
                    subgraphHost: GRAPH_HOST[chainId],
                  },
                  info,
                })
              })
              .then((pools) => {
                return transformer(pools, chainId)
              })
          }),
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

    crossChainStats: async (root, args, context, info) =>
      Promise.all(
        args.chainIds.map((chainId) =>
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
          }).then((pools) => {
            return pools.map((pool) => ({
              ...pool,
              id: `${chainShortName[chainId]}:${pool.id}`,
              chainId,
              chainName: chainName[chainId],
              chainShortName: chainShortName[chainId],
            }))
          })
        )
      ).then((pools) => pools.flat()),
    crossChainFactoryDaySnapshots: async (root, args, context, info) =>
      Promise.all(
        args.chainIds.map((chainId) =>
          context.Exchange.Query.factoryDaySnapshots({
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
          }).then((snapshots) => {
            return snapshots.map((snapshot) => ({
              ...snapshot,
              chainId,
              chainName: chainName[chainId],
              chainShortName: chainShortName[chainId],
            }))
          })
        )
      ).then((snapshots) => snapshots.flat()),
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
                subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
                subgraphHost: GRAPH_HOST[chainId],
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
          .filter((el) => AMM_ENABLED_NETWORKS.includes(el))
          .map((chainId) =>
            context.Exchange.Query.tokens({
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
    crossChainBundles: async (root, args, context, info) =>
      Promise.all(
        args.chainIds.map((chainId) =>
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
            bundles.map((bundle) => ({
              ...bundle,
              chainId,
              chainName: chainName[chainId],
            }))
          )
        )
      ).then((bundles) => bundles.flat()),
  },
}
