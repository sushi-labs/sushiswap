import { BLOCKS_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'

import { Resolvers } from '../.graphclient'

export const resolvers: Resolvers = {
  Block: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    crossChainBlocks: async (root, args, context, info) => {
      return Promise.all(
        args.chainIds.map((chainId) => {
          console.log('GET BLOCKS FOR CHAIN', chainId)
          return context.Blocks.Query.blocks({
            root,
            args,
            context: {
              ...context,
              chainId,
              subgraphName: BLOCKS_SUBGRAPH_NAME[chainId],
              subgraphHost: SUBGRAPH_HOST[chainId],
            },
            info,
          })
        })
      ).then((blocks) => blocks.flat())
    },
  },
}
