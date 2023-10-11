import { Resolvers } from '../../.graphclient/index.js'
import { bundlesByChainIds } from './bundlesByChainIds.js'

export const resolvers: Resolvers = {
  Bundle: {
    chainId: (root, args, context, info) =>
      Number(root.chainId || context.chainId || 1),
  },
  Query: {
    bundlesByChainIds,
  },
}
