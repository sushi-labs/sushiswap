import { chainName, chainShortName } from '@sushiswap/chain'

import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST } from './config'
import { Resolvers } from '.graphclient'

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
  FactoryDaySnapshot: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
    chainShortName: (root, args, context, info) => root.chainShortName || context.chainShortName || 'eth',
  },
  Query: {
    crossChainPairs: async (root, args, context, info) =>
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
            return pools.map((pool) => {
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
              return {
                ...pool,
                volume24h,
                fees24h,
                volume7d,
                fees7d,
                id: `${chainShortName[chainId]}:${pool.id}`,
                chainId,
                chainName: chainName[chainId],
                chainShortName: chainShortName[chainId],
              }
            })
          })
        )
      ).then((pools) =>
        pools
          .flat()
          .sort((a, b) => {
            if (args.orderDirection === 'asc') {
              return a[args.orderBy || 'liquidityUSD'] - b[args.orderBy || 'liquidityUSD']
            } else if (args.orderDirection === 'desc') {
              return b[args.orderBy || 'liquidityUSD'] - a[args.orderBy || 'liquidityUSD']
            }

            return 0
          })
          .slice(args.skip, args.skip + args.first)
      ),
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
  },
}
