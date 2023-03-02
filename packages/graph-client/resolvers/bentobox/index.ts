import { Resolvers } from '../../.graphclient/index.js'
import { rebasesByChainIds } from './rebasesByChainIds.js'

export const resolvers: Resolvers = {
  // BentoBox: {
  //   chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  // },
  Rebase: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    rebasesByChainIds,
  },
}
