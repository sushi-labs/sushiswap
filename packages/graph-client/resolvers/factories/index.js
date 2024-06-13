import { factoriesByChainIds } from './factoriesByChainIds.js';
import { factoryDaySnapshotsByChainIds } from './factoryDaySnapshotsByChainIds.js';
export const resolvers = {
    Factory: {
        chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
    },
    Query: {
        factoriesByChainIds,
        factoryDaySnapshotsByChainIds,
    },
};
//# sourceMappingURL=index.js.map