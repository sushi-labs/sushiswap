import { GraphQLResolveInfo } from 'graphql';
import { Query, QueryResolvers, QuerytokensByChainIdArgs } from '../../.graphclient/index.js';
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js';
import { TridentTypes } from '../../.graphclient/sources/Trident/types.js';
export declare const _tokensByChainId: (root: {}, args: QuerytokensByChainIdArgs, context: SushiSwapTypes.Context & TridentTypes.Context, info: GraphQLResolveInfo) => Promise<Query['tokensByChainId']>;
export declare const tokensByChainId: QueryResolvers['tokensByChainId'];
//# sourceMappingURL=tokensByChainId.d.ts.map