import { Resolvers } from '../../.graphclient'
import { factoriesByChainIds } from './factoriesByChainIds'
import { factoryDaySnapshotsByChainIds } from './factoryDaySnapshotsByChainIds'
export const resolvers: Resolvers = {
  Factory: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    factoriesByChainIds,
    factoryDaySnapshotsByChainIds,
  },
}
