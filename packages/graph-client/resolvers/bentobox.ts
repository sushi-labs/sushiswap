import { BENTOBOX_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'

import { Resolvers } from '../.graphclient'

export const resolvers: Resolvers = {
  Rebase: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
  },
  Query: {
    crossChainRebases: async (root, args, context, info) =>
      Promise.all(
        args.chainIds.map((chainId) =>
          context.Rebase.Query.rebases({
            root,
            args,
            context: {
              ...context,
              chainId,
              subgraphName: BENTOBOX_SUBGRAPH_NAME[chainId],
              subgraphHost: SUBGRAPH_HOST[chainId],
            },
            info,
          }).then((rebases) =>
            rebases.map((rebase) => ({
              ...rebase,
              chainId,
            }))
          )
        )
      ).then((rebases) => rebases.flat()),
  },
}
