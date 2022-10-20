import { MeshTransform, MeshTransformOptions, ImportFn, YamlConfig } from '@graphql-mesh/types';
import { GraphQLSchema } from 'graphql';
import { SubschemaConfig } from '@graphql-tools/delegate';
export default class TypeMerging implements MeshTransform {
    private config;
    importFn: ImportFn;
    constructor({ config, importFn }: MeshTransformOptions<YamlConfig.Transform['typeMerging']>);
    transformSchema(schema: GraphQLSchema, subschemaConfig: SubschemaConfig): GraphQLSchema;
}
