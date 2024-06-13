// @ts-nocheck
import { BENTOBOX_SUBGRAPH_URL } from '@sushiswap/graph-config';
import { isPromiseFulfilled } from 'sushi/validate';
export const rebasesByChainIds = async (root, args, context, info) => {
    return Promise.allSettled(args.chainIds
        .filter((chainId) => chainId in BENTOBOX_SUBGRAPH_URL)
        .map((chainId) => {
        return context.BentoBox.Query.rebases({
            root,
            args,
            context: {
                ...context,
                chainId,
                url: BENTOBOX_SUBGRAPH_URL[chainId],
            },
            info,
        }).then((rebases) => {
            if (!Array.isArray(rebases)) {
                console.error('rebases query failed...', rebases);
                return [];
            }
            return rebases.map((rebase) => ({ ...rebase, chainId }));
        });
    })).then((promiseSettledResults) => promiseSettledResults
        .flat()
        .filter(isPromiseFulfilled)
        .flatMap((promiseFulfilled) => promiseFulfilled.value));
};
//# sourceMappingURL=rebasesByChainIds.js.map