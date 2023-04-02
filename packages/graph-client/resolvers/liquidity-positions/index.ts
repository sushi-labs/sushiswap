import { Resolvers } from '../../.graphclient'
import { liquidityPositionsByChainIds } from './liquidityPositionsByChainIds'

export const resolvers: Resolvers = {
  LiquidityPosition: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    liquidityPositionsByChainIds,
  },
}
