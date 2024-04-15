// @ts-nocheck

import {
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_URL,
} from '@sushiswap/graph-config'
import { isPromiseFulfilled } from 'sushi/validate'

import {
  Factory,
  Query,
  QueryResolvers,
  Resolvers,
} from '../../.graphclient/index.js'

export const factoriesByChainIds: QueryResolvers['factoriesByChainIds'] =
  async (root, args, context, info): Promise<Query['factoriesByChainIds']> => {
    return Promise.allSettled<Query['factoriesByChainIds'][]>([
      ...args.chainIds
        .filter((el): el is (typeof SUSHISWAP_ENABLED_NETWORKS)[number] =>
          SUSHISWAP_ENABLED_NETWORKS.includes(el),
        )
        .map((chainId) =>
          context.SushiSwap.Query.factories({
            root,
            args,
            context: {
              ...context,
              chainId,
              url: SUSHISWAP_SUBGRAPH_URL[chainId],
            },
            info,
          }).then((factories: Factory[]) => {
            return factories?.length > 0
              ? factories.map((factory) => ({
                  ...factory,
                  chainId,
                }))
              : []
          }),
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
    chainId: (root, args, context, info) =>
      Number(root.chainId || context.chainId || 1),
  },
  Query: {
    factoriesByChainIds,
  },
}
