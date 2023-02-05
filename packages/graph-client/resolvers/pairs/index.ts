import { Resolvers } from '../../.graphclient'
import { pairById } from './pairById'
import { pairsByChainId } from './pairsByChainId'
import { pairsByChainIds } from './pairsByChainIds'
import { pairsByIds } from './pairsByIds'


export const resolvers: Resolvers = {
  Pair: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
    // address: (root, args, context, info) => String(root.address || context.address),
  },
  Query: {
    pairById,
    pairsByIds,
    pairsByChainId,
    pairsByChainIds,
  },
}
