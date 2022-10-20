import { MeshTransform, MeshTransformOptions } from '@graphql-mesh/types';
import { GraphQLSchema } from 'graphql';
export default class AddSourceNameTransform implements MeshTransform {
    noWrap: boolean;
    apiName: string;
    constructor({ apiName }: MeshTransformOptions);
    transformSchema(schema: GraphQLSchema): GraphQLSchema;
}
