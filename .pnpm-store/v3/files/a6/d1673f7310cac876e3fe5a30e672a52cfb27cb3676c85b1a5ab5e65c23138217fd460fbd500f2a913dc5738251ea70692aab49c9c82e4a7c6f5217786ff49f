import { getNamedType, GraphQLList } from 'graphql';
import { delegateToSchema } from '@graphql-tools/delegate';
import { batchDelegateToSchema } from '@graphql-tools/batch-delegate';
export function createMergedTypeResolver(mergedTypeResolverOptions) {
    const { fieldName, argsFromKeys, valuesFromResults, args } = mergedTypeResolverOptions;
    if (argsFromKeys != null) {
        return function mergedBatchedTypeResolver(_originalResult, context, info, subschema, selectionSet, key, type = getNamedType(info.returnType)) {
            return batchDelegateToSchema({
                schema: subschema,
                operation: 'query',
                fieldName,
                returnType: new GraphQLList(type),
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
        return function mergedTypeResolver(originalResult, context, info, subschema, selectionSet, _key, type = getNamedType(info.returnType)) {
            return delegateToSchema({
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
