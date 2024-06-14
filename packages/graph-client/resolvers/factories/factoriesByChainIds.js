// @ts-nocheck
import { SUSHISWAP_ENABLED_NETWORKS, SUSHISWAP_SUBGRAPH_URL, } from '@sushiswap/graph-config';
import { isPromiseFulfilled } from 'sushi/validate';
export const factoriesByChainIds = async (root, args, context, info) => {
    return Promise.allSettled([
        ...args.chainIds
            .filter((el) => SUSHISWAP_ENABLED_NETWORKS.includes(el))
            .map((chainId) => context.SushiSwap.Query.factories({
            root,
            args,
            context: {
                ...context,
                chainId,
                url: SUSHISWAP_SUBGRAPH_URL[chainId],
            },
            info,
        }).then((factories) => {
            return factories?.length > 0
                ? factories.map((factory) => ({
                    ...factory,
                    chainId,
                }))
                : [];
        })),
    ]).then((promiseSettledResults) => {
        if (!Array.isArray(promiseSettledResults)) {
            console.error('factories query failed...', promiseSettledResults);
            return [];
        }
        return promiseSettledResults
            .flat()
            .filter(isPromiseFulfilled)
            .flatMap((promiseFulfilled) => promiseFulfilled.value);
    });
};
export const resolvers = {
    Factory: {
        chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
    },
    Query: {
        factoriesByChainIds,
    },
};
//# sourceMappingURL=factoriesByChainIds.js.map