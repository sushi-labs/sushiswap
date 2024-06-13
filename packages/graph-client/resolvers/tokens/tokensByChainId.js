import { _tokensByChainIds } from './tokensByChainIds.js';
export const _tokensByChainId = async (root = {}, args, context, info) => {
    return _tokensByChainIds(root, { ...args, chainIds: [args.chainId] }, context, info);
};
export const tokensByChainId = async (root, args, context, info) => {
    return _tokensByChainId(root, args, context, info);
};
//# sourceMappingURL=tokensByChainId.js.map