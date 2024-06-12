// @ts-nocheck
import { MINICHEF_SUBGRAPH_URL, MASTERCHEF_V1_SUBGRAPH_URL, MASTERCHEF_V2_SUBGRAPH_URL } from '@sushiswap/graph-config';
import { ChainId, chainName } from 'sushi/chain';
import { isPromiseFulfilled } from 'sushi/validate';
export const crossChainChefUser = async (root, args, context, info) => {
    // console.debug('_crossChainChefUser')
    return Promise.allSettled([
        ...args.chainIds
            .filter((chainId) => chainId === ChainId.ETHEREUM)
            .flatMap((chainId) => [
            context.MasterChefV1.Query.MASTERCHEF_V1_users({
                root,
                args,
                context: {
                    ...context,
                    chainId: ChainId.ETHEREUM,
                    url: MASTERCHEF_V1_SUBGRAPH_URL,
                },
                info,
            }).then((users) => {
                if (!Array.isArray(users)) {
                    console.error(`MasterChefV1 users query failed on ${chainId}`, users);
                    return [];
                }
                return users.map((user) => ({
                    ...user,
                    chainId,
                    chainName: chainName[chainId],
                }));
            }),
            context.MasterChefV2.Query.MASTERCHEF_V2_users({
                root,
                args,
                context: {
                    ...context,
                    chainId: ChainId.ETHEREUM,
                    url: MASTERCHEF_V2_SUBGRAPH_URL,
                },
                info,
            }).then((users) => {
                if (!Array.isArray(users)) {
                    console.error(`MasterChefV2 users query failed on ${chainId}`, users);
                    return [];
                }
                return users.map((user) => ({
                    ...user,
                    chainId,
                    chainName: chainName[chainId],
                }));
            }),
        ]),
        ...args.chainIds
            .filter((chainId) => chainId in MINICHEF_SUBGRAPH_URL)
            .map((chainId) => 
        // Weird that we're doing this....
        context.MasterChefV1.Query.MASTERCHEF_V1_users({
            root,
            args,
            context: {
                ...context,
                chainId,
                url: MINICHEF_SUBGRAPH_URL[chainId],
            },
            info,
        }).then((users) => {
            if (!Array.isArray(users)) {
                console.error(`MiniChefV2 users query failed on ${chainId}`, users);
                return [];
            }
            return users.map((user) => ({
                ...user,
                chainId,
                chainName: chainName[chainId],
            }));
        })),
    ]).then((promiseSettledResults) => {
        if (!Array.isArray(promiseSettledResults)) {
            console.log('crossChainChefUser query failed...', promiseSettledResults);
            return [];
        }
        return promiseSettledResults
            .flat()
            .filter(isPromiseFulfilled)
            .flatMap((promiseFulfilled) => promiseFulfilled.value);
        // .filter((user) => user.pool)
    });
};
export const resolvers = {
    ChefUser: {
        chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
    },
    Query: {
        crossChainChefUser,
    },
};
//# sourceMappingURL=index.js.map