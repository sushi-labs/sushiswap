import { GraphQLResolveInfo } from 'graphql';
import { Query, QueryResolvers, QueryfuroTokensByChainIdsArgs, RequireFields } from '../../.graphclient/index.js';
import { FuroStreamTypes } from '../../.graphclient/sources/FuroStream/types.js';
export declare const _furoTokensByChainIds: (root: {}, args: RequireFields<QueryfuroTokensByChainIdsArgs, 'chainIds'>, context: FuroStreamTypes.Context, info: GraphQLResolveInfo) => Promise<Query['furoTokensByChainIds']>;
export declare const furoTokensByChainIds: QueryResolvers['furoTokensByChainIds'];
//# sourceMappingURL=tokensByChainIds.d.ts.map