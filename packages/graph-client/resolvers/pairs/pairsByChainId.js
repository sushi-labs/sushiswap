import { _pairsByChainIds } from './pairsByChainIds.js';
export const _pairsByChainId = async (root = {}, args, context, info) => {
    return _pairsByChainIds(root, { ...args, chainIds: [args.chainId] }, context, info);
};
export const pairsByChainId = async (root, args, context, info) => {
    return _pairsByChainId(root, args, context, info);
};
//# sourceMappingURL=pairsByChainId.js.map