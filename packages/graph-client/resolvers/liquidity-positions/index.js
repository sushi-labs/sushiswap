import { liquidityPositionsByChainIds } from './liquidityPositionsByChainIds.js';
export const resolvers = {
    LiquidityPosition: {
        chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
    },
    Query: {
        liquidityPositionsByChainIds,
    },
};
//# sourceMappingURL=index.js.map