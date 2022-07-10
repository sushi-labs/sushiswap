import { KASHI_SUBGRAPH_HOST, KASHI_SUBGRAPH_NAME } from 'config'

import { Resolvers } from '.graphclient'

export const resolvers: Resolvers = {
  KashiPair: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 137,
  },
  Query: {
    crossChainKashiPairs: async (root, args, context, info) =>
      Promise.all(
        args.chainIds.map((chainId) =>
          context.Kashi.Query.kashiPairs({
            root,
            args,
            context: {
              ...context,
              chainId,
              name: KASHI_SUBGRAPH_NAME[chainId],
              host: KASHI_SUBGRAPH_HOST[chainId],
            },
            info,
          }).then((pairs) =>
            pairs.map((pair) => ({
              ...pair,
              chainId,
            }))
          )
        )
      ).then((kpis) => kpis.flat()),
  },
}
