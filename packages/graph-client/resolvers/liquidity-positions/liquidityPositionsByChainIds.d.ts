import { GraphQLResolveInfo } from 'graphql';
import { QueryResolvers, QueryliquidityPositionsByChainIdsArgs, RequireFields } from '../../.graphclient/index.js';
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js';
import { TridentTypes } from '../../.graphclient/sources/Trident/types.js';
export declare const _liquidityPositionsByChainIds: (root: {}, args: RequireFields<QueryliquidityPositionsByChainIdsArgs, 'skip' | 'first' | 'chainIds'>, context: SushiSwapTypes.Context & TridentTypes.Context, info: GraphQLResolveInfo) => Promise<import("../../.graphclient/index.js").LiquidityPosition[]>;
export declare const liquidityPositionsByChainIds: QueryResolvers['liquidityPositionsByChainIds'];
//# sourceMappingURL=liquidityPositionsByChainIds.d.ts.map