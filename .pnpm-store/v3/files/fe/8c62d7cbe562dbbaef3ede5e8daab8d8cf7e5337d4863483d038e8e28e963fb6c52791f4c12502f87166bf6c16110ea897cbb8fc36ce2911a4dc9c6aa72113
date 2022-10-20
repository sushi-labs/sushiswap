"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMergedTypeResolver = void 0;
const graphql_1 = require("graphql");
const delegate_1 = require("@graphql-tools/delegate");
const batch_delegate_1 = require("@graphql-tools/batch-delegate");
function createMergedTypeResolver(mergedTypeResolverOptions) {
    const { fieldName, argsFromKeys, valuesFromResults, args } = mergedTypeResolverOptions;
    if (argsFromKeys != null) {
        return function mergedBatchedTypeResolver(_originalResult, context, info, subschema, selectionSet, key, type = (0, graphql_1.getNamedType)(info.returnType)) {
            return (0, batch_delegate_1.batchDelegateToSchema)({
                schema: subschema,
                operation: 'query',
                fieldName,
                returnType: new graphql_1.GraphQLList(type),
                key,
                argsFromKeys,
                valuesFromResults,
                selectionSet,
                context,
                info,
                skipTypeMerging: true,
            });
        };
    }
    if (args != null) {
        return function mergedTypeResolver(originalResult, context, info, subschema, selectionSet, _key, type = (0, graphql_1.getNamedType)(info.returnType)) {
            return (0, delegate_1.delegateToSchema)({
                schema: subschema,
                operation: 'query',
                fieldName,
                returnType: type,
                args: args(originalResult),
                selectionSet,
                context,
                info,
                skipTypeMerging: true,
            });
        };
    }
    return undefined;
}
exports.createMergedTypeResolver = createMergedTypeResolver;
