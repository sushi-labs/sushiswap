import { bundlesByChainIds } from './bundlesByChainIds.js';
export const resolvers = {
    Bundle: {
        chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
    },
    Query: {
        bundlesByChainIds,
    },
};
//# sourceMappingURL=index.js.map