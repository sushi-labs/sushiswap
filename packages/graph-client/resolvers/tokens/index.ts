import { Resolvers } from '../../.graphclient'
// import { tokenById } from './tokenById'
import { tokensByChainId } from './tokensByChainId'
import { tokensByChainIds } from './tokensByChainIds'
// import { tokensByIds } from './tokensByIds'

export const resolvers: Resolvers = {
  Token: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    tokensByChainIds,
    tokensByChainId,
    // tokensByIds,
    // tokenById,
  },
}
