import { BENTOBOX_SUBGRAPH_NAME, CHAIN_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'

import { Resolvers } from '../.graphclient'

export const resolvers: Resolvers = {
  Rebase: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
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
              chainName: CHAIN_NAME[chainId],
              subgraphName: BENTOBOX_SUBGRAPH_NAME[chainId],
              subgraphHost: SUBGRAPH_HOST[chainId],
            },
            info,
          }).then((rebases) =>
            rebases.map((rebase) => ({
              ...rebase,
              chainId,
              chainName: CHAIN_NAME[chainId],
            }))
          )
        )
      ).then((rebases) => rebases.flat()),
  },
}
