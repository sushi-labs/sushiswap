import { SUBGRAPH_HOST, SUSHISWAP_ENABLED_NETWORKS, SUSHISWAP_SUBGRAPH_NAME } from '@sushiswap/graph-config'

import { Factory, QueryResolvers, Resolvers } from '../.graphclient'

export const crossChainFactories: QueryResolvers['crossChainFactories'] = async (root, args, context, info) => {
  return Promise.all([
    // ...args.chainIds
    //   .filter((el): el is typeof TRIDENT_ENABLED_NETWORKS[number] => TRIDENT_ENABLED_NETWORKS.includes(el))
    //   .map((chainId) =>
    //     context.Trident.Query.factories({
    //       root,
    //       args,
    //       context: {
    //         ...context,
    //         chainId,
    //         subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
    //         subgraphHost: SUBGRAPH_HOST[chainId],
    //       },
    //       info,
    //     }).then((factories: Factory[]) => {
    //       return factories?.length > 0
    //         ? factories.map((factory) => ({
    //             ...factory,
    //             chainId,
    //           }))
    //         : []
    //     })
    //   ),
    ...args.chainIds
      .filter((el): el is typeof SUSHISWAP_ENABLED_NETWORKS[number] => SUSHISWAP_ENABLED_NETWORKS.includes(el))
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
        }).then((factories: Factory[]) => {
          return factories?.length > 0
            ? factories.map((factory) => ({
                ...factory,
                chainId,
              }))
            : []
        })
      ),
  ]).then((factories) => factories.flat())
}

export const resolvers: Resolvers = {
  Factory: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    crossChainFactories,
  },
}
