import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST } from 'config'

import { CHAIN_NAME } from './config'
import { Resolvers } from '.graphclient'

export const resolvers: Resolvers = {
  Pair: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
  },
  Bundle: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
  },
  Farm: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Arbitrum',
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
              chainName: CHAIN_NAME[chainId],
              subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
              subgraphHost: GRAPH_HOST[chainId],
            },
            info,
          }).then((pools) =>
            pools.map((pool) => ({
              ...pool,
              chainId,
              chainName: CHAIN_NAME[chainId],
            }))
          )
        )
      ).then((pools) => pools.flat()),
    crossChainBundles: async (root, args, context, info) =>
      Promise.all(
        args.chainIds.map((chainId) =>
          context.Exchange.Query.bundles({
            root,
            args,
            context: {
              ...context,
              chainId,
              chainName: CHAIN_NAME[chainId],
              subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
              subgraphHost: GRAPH_HOST[chainId],
            },
            info,
          }).then((bundles) =>
            bundles.map((bundle) => ({
              ...bundle,
              chainId,
              chainName: CHAIN_NAME[chainId],
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
              chainName: CHAIN_NAME[chainId],
              subgraphName: EXCHANGE_SUBGRAPH_NAME[chainId],
              subgraphHost: GRAPH_HOST[chainId],
            },
            info,
          }).then((user) => ({
            ...user,
            id: args.id,
            chainId,
            chainName: CHAIN_NAME[chainId],
            liquidityPositions: user ? user.liquidityPositions : [],
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
