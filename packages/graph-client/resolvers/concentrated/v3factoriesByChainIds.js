import { SUSHISWAP_V3_ENABLED_NETWORKS, SUSHISWAP_V3_SUBGRAPH_URL } from '@sushiswap/graph-config';
import { isPromiseFulfilled } from 'sushi/validate';
export const v3factoriesByChainIds = async (root, args, context, info) => {
    return Promise.allSettled(args.chainIds
        .filter((chainId) => SUSHISWAP_V3_ENABLED_NETWORKS.includes(chainId))
        .map((chainId) => {
        return context.SushiSwapV3.Query.SUSHISWAP_V3_factories({
            root,
            args,
            context: {
                ...context,
                chainId,
                url: SUSHISWAP_V3_SUBGRAPH_URL[chainId]
            },
            info,
        }).then((factories) => {
            return factories?.length > 0
                ? factories.map((factory) => ({
                    ...factory,
                    chainId,
                }))
                : [];
        });
    })).then((promiseSettledResults) => {
        if (!Array.isArray(promiseSettledResults)) {
            console.error('v3 factories query failed...', promiseSettledResults);
            return [];
        }
        return promiseSettledResults
            .flat()
            .filter(isPromiseFulfilled)
            .flatMap((promiseFulfilled) => promiseFulfilled.value);
    });
};
//# sourceMappingURL=v3factoriesByChainIds.js.map