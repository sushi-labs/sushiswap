import { MeshMerger, MeshMergerContext, MeshMergerOptions } from '@graphql-mesh/types';
import { GraphQLSchema } from 'graphql';
export default class BareMerger implements MeshMerger {
    private options;
    name: string;
    private stitchingMerger;
    constructor(options: MeshMergerOptions);
    handleSingleWrappedExtendedSource(mergerCtx: MeshMergerContext): Promise<{
        schema: GraphQLSchema;
    }>;
    handleSingleRegularSource({ rawSources: [rawSource], typeDefs, resolvers }: MeshMergerContext): {
        schema: GraphQLSchema;
        name: string;
        executor?: import("@graphql-tools/utils").Executor<Record<string, any>, Record<string, any>>;
        transforms: import("@graphql-mesh/types").MeshTransform<any>[];
        contextVariables: Record<string, string>;
        handler: import("@graphql-mesh/types").MeshHandler;
        batch: boolean;
        merge?: Record<string, import("@graphql-tools/delegate").MergedTypeConfig<any, any, Record<string, any>>>;
        createProxyingResolver: import("@graphql-tools/delegate").CreateProxyingResolverFn<any>;
    };
    getUnifiedSchema({ rawSources, typeDefs, resolvers }: MeshMergerContext): Promise<{
        schema: GraphQLSchema;
    }>;
}
