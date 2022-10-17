import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
} from '@sushiswap/graph-config'

import { QueryResolvers } from '../../.graphclient'

export const crossChainBundles: QueryResolvers['crossChainBundles'] = async (root, args, context, info) => {
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
}
