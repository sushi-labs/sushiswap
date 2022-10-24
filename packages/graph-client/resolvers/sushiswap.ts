import { Resolvers } from '../.graphclient'
import {
  crossChainBundles,
  crossChainChefUser,
  crossChainFactories,
  crossChainFactoryDaySnapshots,
  crossChainPair,
  crossChainPairs,
  crossChainToken,
  crossChainTokens,
  crossChainUsers,
  crossChainUserWithFarms,
} from './sushiswap/index'
/* eslint no-unused-vars: 0, unused-imports/no-unused-vars: 0, @typescript-eslint/no-unused-vars: 0 */

export const resolvers: Resolvers = {
  Bundle: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Factory: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  FactoryDaySnapshot: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
    chainShortName: (root, args, context, info) => root.chainShortName || context.chainShortName || 'eth',
  },
  Pair: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
    chainName: (root, args, context, info) => root.chainName || context.chainName || 'Ethereum',
    chainShortName: (root, args, context, info) => root.chainShortName || context.chainShortName || 'eth',
    volume1d: (root, args, context, info) => root.volume1d || '0',
    volume1w: (root, args, context, info) => root.volume1w || '0',
    fees1d: (root, args, context, info) => root.fees1d || '0',
    fees1w: (root, args, context, info) => root.fees1w || '0',
  },
  Query: {
    crossChainBundles,
    crossChainFactories,
    crossChainFactoryDaySnapshots,
    crossChainPair,
    crossChainPairs,
    crossChainTokens,
    crossChainToken,
    crossChainUsers,
    crossChainChefUser,
    crossChainUserWithFarms,
  },
}
