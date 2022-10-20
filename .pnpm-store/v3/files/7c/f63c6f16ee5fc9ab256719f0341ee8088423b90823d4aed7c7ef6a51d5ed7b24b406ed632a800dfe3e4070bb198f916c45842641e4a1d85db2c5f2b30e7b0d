import { MeshMerger, MeshMergerContext, MeshMergerOptions } from '@graphql-mesh/types';
import { GraphQLSchema } from 'graphql';
export default class StitchingMerger implements MeshMerger {
    name: string;
    private logger;
    private store;
    constructor(options: MeshMergerOptions);
    private isFederatedSchema;
    private replaceFederationSDLWithStitchingSDL;
    getUnifiedSchema(context: MeshMergerContext): Promise<{
        schema: GraphQLSchema;
    }>;
}
