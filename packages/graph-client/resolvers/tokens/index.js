// import { tokenById } from './tokenById'
import { tokensByChainId } from './tokensByChainId.js';
import { tokensByChainIds } from './tokensByChainIds.js';
// import { tokensByIds } from './tokensByIds'
export const resolvers = {
    Token: {
        chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
    },
    Query: {
        tokensByChainIds,
        tokensByChainId,
        // tokensByIds,
        // tokenById,
    },
};
//# sourceMappingURL=index.js.map