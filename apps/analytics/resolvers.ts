import { chainName, chainShortName } from '@sushiswap/chain'

import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST } from './config'
import { Resolvers } from '.graphclient'

export const resolvers: Resolvers = {
  Pair: {
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
              const volume24h =
                pool.hourSnapshots?.[0]?.volumeUSD - pool.hourSnapshots?.[pool.hourSnapshots.length - 1]?.volumeUSD
              const fees24h =
                pool.hourSnapshots?.[0]?.feesUSD - pool.hourSnapshots?.[pool.hourSnapshots.length - 1]?.feesUSD
              const volume7d =
                pool.daySnapshots?.[0]?.volumeUSD - pool.daySnapshots?.[pool.daySnapshots.length - 1]?.volumeUSD
              const fees7d =
                pool.daySnapshots?.[0]?.feesUSD - pool.daySnapshots?.[pool.daySnapshots.length - 1]?.feesUSD

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
        pools.flat().sort((a, b) => {
          if (args.orderDirection === 'asc') {
            return a.liquidityUSD - b.liquidityUSD
          } else if (args.orderDirection === 'desc') {
            return b.liquidityUSD - a.liquidityUSD
          }

          return 0
        })
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
  },
}
