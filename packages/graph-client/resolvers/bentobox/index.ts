import { BENTOBOX_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'
import { isPromiseFulfilled } from '@sushiswap/validate'

import { Query, QueryResolvers, Resolvers } from '../../.graphclient'

export const crossChainRebases: QueryResolvers['crossChainRebases'] = async (
  root,
  args,
  context,
  info
): Promise<Query['crossChainRebases']> => {
  return Promise.allSettled<Query['rebases'][]>(
    args.chainIds
      .filter((chainId): chainId is keyof typeof BENTOBOX_SUBGRAPH_NAME => chainId in BENTOBOX_SUBGRAPH_NAME)
      .map((chainId) => {
        return context.BentoBox.Query.rebases({
          root,
          args,
          context: {
            ...context,
            chainId,
            subgraphName: BENTOBOX_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((rebases) => {
          return rebases.map((rebase) => ({ ...rebase, chainId }))
        })
      })
  ).then((promiseSettledResults) => {
    if (!Array.isArray(promiseSettledResults)) {
      console.error('rebases query failed...', promiseSettledResults)
      return []
    }
    return promiseSettledResults
      .flat()
      .filter(isPromiseFulfilled)
      .flatMap((promiseFulfilled) => promiseFulfilled.value)
  })
}

export const resolvers: Resolvers = {
  // BentoBox: {
  //   chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  // },
  Rebase: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    crossChainRebases,
  },
}
