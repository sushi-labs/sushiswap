import { GraphQLResolveInfo } from 'graphql';
import { Query, QueryResolvers, QuerypairsByChainIdArgs } from '../../.graphclient/index.js';
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js';
import { TridentTypes } from '../../.graphclient/sources/Trident/types.js';
export declare const _pairsByChainId: (root: {}, args: QuerypairsByChainIdArgs, context: SushiSwapTypes.Context & TridentTypes.Context, info: GraphQLResolveInfo) => Promise<Query['pairsByChainId']>;
export declare const pairsByChainId: QueryResolvers['pairsByChainId'];
//# sourceMappingURL=pairsByChainId.d.ts.map