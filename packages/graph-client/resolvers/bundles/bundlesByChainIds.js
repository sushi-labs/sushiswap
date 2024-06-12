// @ts-nocheck
import { SUSHISWAP_ENABLED_NETWORKS, SUSHISWAP_SUBGRAPH_URL, TRIDENT_ENABLED_NETWORKS, TRIDENT_SUBGRAPH_URL, } from '@sushiswap/graph-config';
export const bundlesByChainIds = async (root, args, context, info) => {
    return Promise.all([
        ...args.chainIds
            .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
            .map((chainId) => context.Trident.Query.bundles({
            root,
            args,
            context: {
                ...context,
                chainId,
                url: TRIDENT_SUBGRAPH_URL[chainId],
            },
            info,
        }).then((bundles) => bundles?.length > 0
            ? bundles.map((bundle) => ({
                ...bundle,
                chainId,
            }))
            : [])),
        ...args.chainIds
            .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
            .map((chainId) => context.SushiSwap.Query.bundles({
            root,
            args,
            context: {
                ...context,
                chainId,
                url: SUSHISWAP_SUBGRAPH_URL[chainId],
            },
            info,
        }).then((bundles) => bundles?.length > 0
            ? bundles.map((bundle) => ({
                ...bundle,
                chainId,
            }))
            : [])),
    ]).then((bundles) => bundles.flat());
};
//# sourceMappingURL=bundlesByChainIds.js.map