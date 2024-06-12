// @ts-nocheck
import { SUSHISWAP_ENABLED_NETWORKS, SUSHISWAP_SUBGRAPH_URL, TRIDENT_ENABLED_NETWORKS, TRIDENT_SUBGRAPH_URL, } from '@sushiswap/graph-config';
import { isPromiseFulfilled } from 'sushi/validate';
export const _liquidityPositionsByChainIds = async (root = {}, args, context, info) => {
    const liquidityPositions = await Promise.allSettled([
        ...args.chainIds
            .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
            .map((chainId) => context.SushiSwap.Query.liquidityPositions({
            root,
            args,
            context: {
                ...context,
                chainId,
                url: SUSHISWAP_SUBGRAPH_URL[chainId],
            },
            info,
        }).then((liquidityPositions) => {
            if (!Array.isArray(liquidityPositions)) {
                console.error(`SushiSwap liquidityPositions query failed on ${chainId}`, liquidityPositions);
                return [];
            }
            return liquidityPositions.map((liquidityPosition) => ({
                ...liquidityPosition,
                chainId,
            }));
        })),
        ...args.chainIds
            .filter((el) => TRIDENT_ENABLED_NETWORKS.includes(el))
            .map((chainId) => context.Trident.Query.liquidityPositions({
            root,
            args,
            context: {
                ...context,
                chainId,
                url: TRIDENT_SUBGRAPH_URL[chainId],
            },
            info,
        }).then((liquidityPositions) => {
            if (!Array.isArray(liquidityPositions)) {
                console.error(`Trident liquidityPositions query failed on ${chainId}`, liquidityPositions);
                return [];
            }
            return liquidityPositions.map((liquidityPosition) => ({
                ...liquidityPosition,
                chainId,
            }));
        })),
    ]).then((promiseSettledResults) => {
        if (!Array.isArray(promiseSettledResults)) {
            console.error('crossChainLiquidityPositions query failed');
            return [];
        }
        return promiseSettledResults
            .flat()
            .filter(isPromiseFulfilled)
            .flatMap((promiseFulfilled) => promiseFulfilled.value);
    });
    return liquidityPositions;
};
export const liquidityPositionsByChainIds = async (root, args, context, info) => {
    return _liquidityPositionsByChainIds(root, args, context, info);
};
//# sourceMappingURL=liquidityPositionsByChainIds.js.map