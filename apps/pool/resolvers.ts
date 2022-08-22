import { chainName, chainShortName } from '@sushiswap/chain'
import {
  AMM_ENABLED_NETWORKS,
  EXCHANGE_SUBGRAPH_NAME,
  GRAPH_HOST,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from 'config'

import { Resolvers } from '.graphclient'

export const resolvers: Resolvers = {
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
  Farm: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
  },
  Query: {
    crossChainPair: async (root, args, context, info) =>
      context.Exchange.Query.pair({
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
      }).then((pool) => ({
        ...pool,
        id: `${chainShortName[args.chainId]}:${pool.id}`,
        chainId: args.chainId,
        chainName: chainName[args.chainId],
        chainShortName: chainShortName[args.chainId],
      })),
    crossChainPairs: async (root, args, context, info) => {
      const transformer = (pools, chainId) =>
        pools.map((pool) => {
          const volume7d = pool.daySnapshots?.reduce((previousValue, currentValue, i) => {
            if (i > 6) return previousValue
            return previousValue + Number(currentValue.volumeUSD)
          }, 0)

          return {
            ...pool,
            volume7d,
            id: `${chainShortName[chainId]}:${pool.id}`,
            chainId,
            chainName: chainName[chainId],
            chainShortName: chainShortName[chainId],
          }
        })

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
      ]).then((pools) =>
        pools.flat().sort((a, b) => {
          if (args.orderDirection === 'asc') {
            return a[args.orderBy || 'apr'] - b[args.orderBy || 'apr']
          } else if (args.orderDirection === 'desc') {
            return b[args.orderBy || 'apr'] - a[args.orderBy || 'apr']
          }

          return 0
        })
      )
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
    crossChainUser: async (root, args, context, info) =>
      Promise.all(
        args.chainIds.map((chainId) =>
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
          }).then((user) => ({
            ...user,
            id: args.id,
            chainId,
            chainName: chainName[chainId],
            liquidityPositions: user
              ? user.liquidityPositions.map((el) => ({
                  ...el,
                  pair: {
                    ...el.pair,
                    chainId,
                    chainName: chainName[chainId],
                    chainShortName: chainShortName[chainId],
                  },
                }))
              : [],
          }))
        )
      ).then((users) => {
        return users.flat().reduce(
          (acc, cur) => {
            return {
              ...acc,
              liquidityPositions: [...acc.liquidityPositions, ...cur.liquidityPositions],
            }
          },
          { liquidityPositions: [] }
        )
      }),
  },
}
