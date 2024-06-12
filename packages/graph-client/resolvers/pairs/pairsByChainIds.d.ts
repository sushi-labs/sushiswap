import { GraphQLResolveInfo } from 'graphql';
import { Query, QueryResolvers, QuerypairsByChainIdsArgs } from '../../.graphclient/index.js';
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js';
import { TridentTypes } from '../../.graphclient/sources/Trident/types.js';
export declare const _pairsByChainIds: (root: {}, args: QuerypairsByChainIdsArgs, context: SushiSwapTypes.Context & TridentTypes.Context, info: GraphQLResolveInfo) => Promise<Query['pairsByChainIds']>;
export declare const pairsByChainIds: QueryResolvers['pairsByChainIds'];
//# sourceMappingURL=pairsByChainIds.d.ts.map