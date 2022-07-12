import { Resolvers } from '../.graphclient'
import { BLOCKS_SUBGRAPH_NAME, CHAIN_NAME, SUBGRAPH_HOST } from '../config'

export const resolvers: Resolvers = {
  Block: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
  },
  Query: {
    crossChainBlocks: async (root, args, context, info) =>
      Promise.all(
        args.chainIds.map((chainId) =>
          context.Blocks.Query.rebases({
            root,
            args,
            context: {
              ...context,
              chainId,
              chainName: CHAIN_NAME[chainId],
              subgraphName: BLOCKS_SUBGRAPH_NAME[chainId],
              subgraphHost: SUBGRAPH_HOST[chainId],
            },
            info,
          }).then((blocks) =>
            blocks.map((block) => ({
              ...block,
              chainId,
              chainName: CHAIN_NAME[chainId],
            }))
          )
        )
      ).then((blocks) => blocks.flat()),
  },
}
