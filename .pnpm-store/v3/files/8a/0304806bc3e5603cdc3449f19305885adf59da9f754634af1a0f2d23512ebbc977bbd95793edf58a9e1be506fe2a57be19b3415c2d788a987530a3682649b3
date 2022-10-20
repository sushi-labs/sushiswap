import { GraphQLSchema } from 'graphql';
import { MeshTransform, YamlConfig, MeshTransformOptions } from '@graphql-mesh/types';
export default class BarePrefix implements MeshTransform {
    noWrap: boolean;
    private ignoreList;
    private includeRootOperations;
    private includeTypes;
    private prefix;
    constructor(options: MeshTransformOptions<YamlConfig.PrefixTransformConfig>);
    transformSchema(schema: GraphQLSchema): GraphQLSchema;
}
