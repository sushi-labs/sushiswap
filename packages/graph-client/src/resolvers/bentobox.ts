import { BENTOBOX_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'

import { QueryResolvers, Rebase, Resolvers } from '../../.graphclient'

const crossChainRebases: QueryResolvers['crossChainRebases'] = async (root, args, context, info): Promise<Rebase[]> =>
  Promise.all(
    args.chainIds
      .filter((chainId): chainId is keyof typeof BENTOBOX_SUBGRAPH_NAME => chainId in BENTOBOX_SUBGRAPH_NAME)
      .map((chainId) =>
        context.BentoBox.Query.rebases({
          root,
          args,
          context: {
            ...context,
            chainId,
            subgraphName: BENTOBOX_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        })
      )
  ).then((rebases) => rebases.flat())

export const resolvers: Resolvers = {
  Rebase: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    crossChainRebases,
  },
}
