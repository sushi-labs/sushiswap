"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapSchema = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const delegate_1 = require("@graphql-tools/delegate");
const generateProxyingResolvers_js_1 = require("./generateProxyingResolvers.js");
exports.wrapSchema = (0, utils_1.memoize1)(function wrapSchema(subschemaConfig) {
    const targetSchema = subschemaConfig.schema;
    const proxyingResolvers = (0, generateProxyingResolvers_js_1.generateProxyingResolvers)(subschemaConfig);
    const schema = createWrappingSchema(targetSchema, proxyingResolvers);
    return (0, delegate_1.applySchemaTransforms)(schema, subschemaConfig);
});
function createWrappingSchema(schema, proxyingResolvers) {
    return (0, utils_1.mapSchema)(schema, {
        [utils_1.MapperKind.ROOT_OBJECT]: type => {
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
            return new graphql_1.GraphQLObjectType(config);
        },
        [utils_1.MapperKind.OBJECT_TYPE]: type => {
            const config = type.toConfig();
            config.isTypeOf = undefined;
            for (const fieldName in config.fields) {
                const field = config.fields[fieldName];
                if (field == null) {
                    continue;
                }
                field.resolve = delegate_1.defaultMergedResolver;
                field.subscribe = undefined;
            }
            return new graphql_1.GraphQLObjectType(config);
        },
        [utils_1.MapperKind.INTERFACE_TYPE]: type => {
            const config = type.toConfig();
            delete config.resolveType;
            return new graphql_1.GraphQLInterfaceType(config);
        },
        [utils_1.MapperKind.UNION_TYPE]: type => {
            const config = type.toConfig();
            delete config.resolveType;
            return new graphql_1.GraphQLUnionType(config);
        },
    });
}
