// @ts-nocheck
import { FURO_SUBGRAPH_URL } from '@sushiswap/graph-config';
import { isPromiseFulfilled } from 'sushi/validate';
export const _furoTokensByChainIds = async (root = {}, args, context, info) => {
    return Promise.allSettled(args.chainIds
        .filter((chainId) => chainId in FURO_SUBGRAPH_URL)
        .map((chainId) => {
        return context.FuroStream.Query.tokens({
            root,
            args,
            context: {
                ...context,
                chainId,
                url: FURO_SUBGRAPH_URL[chainId],
            },
            info,
        }).then((tokens) => {
            if (!Array.isArray(tokens)) {
                console.error(`Furo tokens query failed on ${chainId}`, tokens);
                return [];
            }
            return tokens.map((token) => ({ ...token, chainId }));
        });
    })).then((promiseSettledResults) => promiseSettledResults
        .flat()
        .filter(isPromiseFulfilled)
        .flatMap((promiseFulfilled) => promiseFulfilled.value));
};
export const furoTokensByChainIds = async (root, args, context, info) => _furoTokensByChainIds(root, args, context, info);
//# sourceMappingURL=tokensByChainIds.js.map