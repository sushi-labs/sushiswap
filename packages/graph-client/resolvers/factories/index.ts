import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
} from '@sushiswap/graph-config'
import { isPromiseFulfilled } from '@sushiswap/validate'

import { Factory, Query, QueryResolvers, Resolvers } from '../../.graphclient'

export const crossChainFactories: QueryResolvers['crossChainFactories'] = async (
  root,
  args,
  context,
  info
): Promise<Query['crossChainFactories']> => {
  return Promise.allSettled<Query['crossChainFactories'][]>([
    ...args.chainIds
      .filter((el): el is typeof TRIDENT_ENABLED_NETWORKS[number] => TRIDENT_ENABLED_NETWORKS.includes(el))
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
        }).then((factories: Factory[]) => {
          return factories?.length > 0
            ? factories.map((factory) => ({
                ...factory,
                chainId,
              }))
            : []
        })
      ),
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
  ]).then((promiseSettledResults) => {
    if (!Array.isArray(promiseSettledResults)) {
      console.error('factories query failed...', promiseSettledResults)
      return []
    }
    return promiseSettledResults
      .flat()
      .filter(isPromiseFulfilled)
      .flatMap((promiseFulfilled) => promiseFulfilled.value)
  })
}

export const resolvers: Resolvers = {
  Factory: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    crossChainFactories,
  },
}
