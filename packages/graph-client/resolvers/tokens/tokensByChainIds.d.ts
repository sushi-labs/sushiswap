import { GraphQLResolveInfo } from 'graphql';
import { Query, QueryResolvers, QuerytokensByChainIdsArgs } from '../../.graphclient/index.js';
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js';
import { TridentTypes } from '../../.graphclient/sources/Trident/types.js';
export declare const _tokensByChainIds: (root: {}, args: QuerytokensByChainIdsArgs, context: SushiSwapTypes.Context & TridentTypes.Context, info: GraphQLResolveInfo) => Promise<Query['tokensByChainIds']>;
export declare const tokensByChainIds: QueryResolvers['tokensByChainIds'];
//# sourceMappingURL=tokensByChainIds.d.ts.map