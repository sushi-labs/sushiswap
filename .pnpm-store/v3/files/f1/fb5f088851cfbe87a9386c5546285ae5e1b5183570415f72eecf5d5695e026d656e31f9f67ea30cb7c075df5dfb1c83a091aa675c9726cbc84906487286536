import { GraphQLSchema } from 'graphql';
import { MeshTransform, YamlConfig } from '@graphql-mesh/types';
export default class BareFilter implements MeshTransform {
    noWrap: boolean;
    typeGlobs: string[];
    fieldsMap: Map<string, string[]>;
    argsMap: Map<string, string[]>;
    constructor({ config: { filters } }: {
        config: YamlConfig.FilterSchemaTransform;
    });
    matchInArray(rulesArray: string[], value: string): null | undefined;
    transformSchema(schema: GraphQLSchema): GraphQLSchema;
}
