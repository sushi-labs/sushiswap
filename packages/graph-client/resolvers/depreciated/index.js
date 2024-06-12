import { crossChainToken } from './crossChainToken.js';
export const resolvers = {
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
        crossChainToken,
    },
};
//# sourceMappingURL=index.js.map