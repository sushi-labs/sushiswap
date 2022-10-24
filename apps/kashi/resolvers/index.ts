import { Resolvers } from '../.graphclient'
import { dashboard } from './dashboard'
import { datapoints } from './datapoints'
import { pair } from './pair'
import { pairs } from './pairs'
export const resolvers: Resolvers = {
  KashiPair: {
    chainId: (root, args, context, info) => root.chainId || context.chainId || 1,
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
  },
  Query: {
    dashboard,
    datapoints,
    pair,
    pairs,
  },
}
