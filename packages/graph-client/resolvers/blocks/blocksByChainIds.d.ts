import { GraphQLResolveInfo } from 'graphql';
import { Query, QueryResolvers, QueryblocksByChainIdsArgs, RequireFields } from '../../.graphclient/index.js';
import { BlocksTypes } from '../../.graphclient/sources/Blocks/types.js';
export declare const _blocksByChainIds: (root: {}, args: RequireFields<QueryblocksByChainIdsArgs, 'skip' | 'first' | 'chainIds'>, context: BlocksTypes.Context, info: GraphQLResolveInfo) => Promise<Query['blocksByChainIds']>;
export declare const blocksByChainIds: QueryResolvers['blocksByChainIds'];
//# sourceMappingURL=blocksByChainIds.d.ts.map