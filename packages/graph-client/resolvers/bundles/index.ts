import { Resolvers } from '../../.graphclient'
import { bundlesByChainIds } from './bundlesByChainIds'

export const resolvers: Resolvers = {
  Bundle: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    bundlesByChainIds,
  },
}
