import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'

import { Bundle, QueryResolvers, Resolvers } from '../.graphclient'

export const crossChainBundles: QueryResolvers['crossChainBundles'] = async (root, args, context, info) => {
  return Promise.all([
    ...args.chainIds
      .filter((el): el is typeof TRIDENT_ENABLED_NETWORKS[number] => TRIDENT_ENABLED_NETWORKS.includes(el))
      .map((chainId) =>
        context.Trident.Query.bundles({
          root,
          args,
          context: {
            ...context,
            chainId,
            subgraphName: TRIDENT_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((bundles: Bundle[]) =>
          bundles?.length > 0
            ? bundles.map((bundle) => ({
                ...bundle,
                chainId,
              }))
            : []
        )
      ),
    ...args.chainIds
      .filter((el): el is typeof SUSHISWAP_ENABLED_NETWORKS[number] => SUSHISWAP_ENABLED_NETWORKS.includes(el))
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
        }).then((bundles: Bundle[]) =>
          bundles?.length > 0
            ? bundles.map((bundle) => ({
                ...bundle,
                chainId,
              }))
            : []
        )
      ),
  ]).then((bundles) => bundles.flat())
}

export const resolvers: Resolvers = {
  Bundle: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    crossChainBundles,
  },
}
