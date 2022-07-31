import { KASHI_SUBGRAPH_HOST, KASHI_SUBGRAPH_NAME } from 'config'

import { CHAIN_NAME } from './config'
import { Resolvers } from '.graphclient'

export const resolvers: Resolvers = {
  KashiPair: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
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
              chainName: CHAIN_NAME[chainId],
              subgraphName: KASHI_SUBGRAPH_NAME[chainId],
              subgraphHost: KASHI_SUBGRAPH_HOST[chainId],
            },
            info,
          }).then((pairs) =>
            pairs.map((pair) => ({
              ...pair,
              chainId,
              chainName: CHAIN_NAME[chainId],
            }))
          )
        )
      ).then((kpis) => kpis.flat()),
  },
}
