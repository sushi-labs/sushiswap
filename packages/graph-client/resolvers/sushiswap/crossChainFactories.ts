import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
} from '@sushiswap/graph-config'

import { QueryResolvers } from '../../.graphclient'

export const crossChainFactories: QueryResolvers['crossChainFactories'] = async (root, args, context, info) => {
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
}
