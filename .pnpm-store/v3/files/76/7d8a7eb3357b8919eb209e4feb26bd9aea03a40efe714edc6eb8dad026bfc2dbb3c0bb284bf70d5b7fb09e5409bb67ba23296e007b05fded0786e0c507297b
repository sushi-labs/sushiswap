import { GraphQLObjectType, GraphQLInterfaceType, GraphQLUnionType, } from 'graphql';
import { MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultMergedResolver, applySchemaTransforms } from '@graphql-tools/delegate';
import { generateProxyingResolvers } from './generateProxyingResolvers.js';
export function wrapSchema(subschemaConfig) {
    const targetSchema = subschemaConfig.schema;
    const proxyingResolvers = generateProxyingResolvers(subschemaConfig);
    const schema = createWrappingSchema(targetSchema, proxyingResolvers);
    const transformedSchema = applySchemaTransforms(schema, subschemaConfig);
    return applySchemaTransforms(schema, subschemaConfig, transformedSchema);
}
function createWrappingSchema(schema, proxyingResolvers) {
    return mapSchema(schema, {
        [MapperKind.ROOT_OBJECT]: type => {
            var _a;
            const config = type.toConfig();
            const fieldConfigMap = config.fields;
            for (const fieldName in fieldConfigMap) {
                const field = fieldConfigMap[fieldName];
                if (field == null) {
                    continue;
                }
                fieldConfigMap[fieldName] = {
                    ...field,
                    ...(_a = proxyingResolvers[type.name]) === null || _a === void 0 ? void 0 : _a[fieldName],
                };
            }
            return new GraphQLObjectType(config);
        },
        [MapperKind.OBJECT_TYPE]: type => {
            const config = type.toConfig();
            config.isTypeOf = undefined;
            for (const fieldName in config.fields) {
                const field = config.fields[fieldName];
                if (field == null) {
                    continue;
                }
                field.resolve = defaultMergedResolver;
                field.subscribe = undefined;
            }
            return new GraphQLObjectType(config);
        },
        [MapperKind.INTERFACE_TYPE]: type => {
            const config = type.toConfig();
            delete config.resolveType;
            return new GraphQLInterfaceType(config);
        },
        [MapperKind.UNION_TYPE]: type => {
            const config = type.toConfig();
            delete config.resolveType;
            return new GraphQLUnionType(config);
        },
    });
}
