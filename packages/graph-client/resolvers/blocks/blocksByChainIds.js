// @ts-nocheck
import { BLOCKS_SUBGRAPH_URL } from '@sushiswap/graph-config';
export const _blocksByChainIds = async (root = {}, args, context, info) => {
    return Promise.all(args.chainIds
        .filter((chainId) => chainId in BLOCKS_SUBGRAPH_URL)
        .map((chainId) => {
        return context.Blocks.Query.blocks({
            root,
            args,
            context: {
                ...context,
                chainId,
                url: BLOCKS_SUBGRAPH_URL[chainId],
            },
            info,
        }).then((blocks) => {
            if (!Array.isArray(blocks)) {
                // console.error(`Blocks query failed on ${chainId}`, blocks)
                return [];
            }
            // console.debug(`Blocks ${chainId}`, blocks)
            return blocks.map((block) => ({ ...block, chainId }));
        });
    })).then((blocks) => blocks.flat());
};
export const blocksByChainIds = async (root, args, context, info) => _blocksByChainIds(root, args, context, info);
//# sourceMappingURL=blocksByChainIds.js.map