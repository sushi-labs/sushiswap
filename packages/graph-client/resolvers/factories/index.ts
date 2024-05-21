import { Resolvers } from '../../.graphclient/index.js'
import { factoriesByChainIds } from './factoriesByChainIds.js'
// import { factoryDaySnapshotsByChainIds } from './factoryDaySnapshotsByChainIds.js'
export const resolvers: Resolvers = {
  Factory: {
    chainId: (root, args, context, info) =>
      Number(root.chainId || context.chainId || 1),
  },
  Query: {
    factoriesByChainIds,
    // factoryDaySnapshotsByChainIds,
  },
}
