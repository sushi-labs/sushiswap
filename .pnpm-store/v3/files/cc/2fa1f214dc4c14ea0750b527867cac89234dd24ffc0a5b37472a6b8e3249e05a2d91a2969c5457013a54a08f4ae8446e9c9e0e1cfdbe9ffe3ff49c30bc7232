import { MapperKind, mapSchema } from '@graphql-tools/utils';
import { GraphQLObjectType, GraphQLString } from 'graphql';
export default class AddSourceNameTransform {
    constructor({ apiName }) {
        this.noWrap = true;
        this.apiName = apiName;
    }
    transformSchema(schema) {
        return mapSchema(schema, {
            [MapperKind.OBJECT_TYPE]: (type) => {
                const typeConfig = type.toConfig();
                typeConfig.fields.sourceName = {
                    type: GraphQLString,
                    resolve: () => this.apiName,
                };
                return new GraphQLObjectType(typeConfig);
            },
        });
    }
}
