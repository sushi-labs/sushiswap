import { Resolvers } from '../../.graphclient'
import { crossChainFactoryDaySnapshots } from './crossChainFactoryDaySnapshots'
import { crossChainPair } from './crossChainPair'
import { crossChainToken } from './crossChainToken'

export const resolvers: Resolvers = {
  deprecated_Pair: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  deprecated_Token: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  deprecated_LiquidityPosition: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    crossChainPair,
    crossChainFactoryDaySnapshots,
    crossChainToken,
  },
}
