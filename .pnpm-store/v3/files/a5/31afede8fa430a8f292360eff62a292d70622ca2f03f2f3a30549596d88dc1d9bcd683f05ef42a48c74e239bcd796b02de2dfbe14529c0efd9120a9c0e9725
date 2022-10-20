import { responsePathAsArray, GraphQLError, locatedError, } from 'graphql';
import { collectFields, relocatedError } from '@graphql-tools/utils';
import { FIELD_SUBSCHEMA_MAP_SYMBOL, OBJECT_SUBSCHEMA_SYMBOL, UNPATHED_ERRORS_SYMBOL } from './symbols.js';
export function isExternalObject(data) {
    return data[UNPATHED_ERRORS_SYMBOL] !== undefined;
}
export function annotateExternalObject(object, errors, subschema, subschemaMap) {
    Object.defineProperties(object, {
        [OBJECT_SUBSCHEMA_SYMBOL]: { value: subschema },
        [FIELD_SUBSCHEMA_MAP_SYMBOL]: { value: subschemaMap },
        [UNPATHED_ERRORS_SYMBOL]: { value: errors },
    });
    return object;
}
export function getSubschema(object, responseKey) {
    var _a;
    return (_a = object[FIELD_SUBSCHEMA_MAP_SYMBOL][responseKey]) !== null && _a !== void 0 ? _a : object[OBJECT_SUBSCHEMA_SYMBOL];
}
export function getUnpathedErrors(object) {
    return object[UNPATHED_ERRORS_SYMBOL];
}
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = Object.create(null);
export async function mergeFields(mergedTypeInfo, object, sourceSubschema, context, info) {
    var _a;
    const delegationMaps = mergedTypeInfo.delegationPlanBuilder(info.schema, sourceSubschema, info.variableValues != null && Object.keys(info.variableValues).length > 0 ? info.variableValues : EMPTY_OBJECT, info.fragments != null && Object.keys(info.fragments).length > 0 ? info.fragments : EMPTY_OBJECT, ((_a = info.fieldNodes) === null || _a === void 0 ? void 0 : _a.length) ? info.fieldNodes : EMPTY_ARRAY);
    for (const delegationMap of delegationMaps) {
        await executeDelegationStage(mergedTypeInfo, delegationMap, object, context, info);
    }
    return object;
}
async function executeDelegationStage(mergedTypeInfo, delegationMap, object, context, info) {
    const combinedErrors = object[UNPATHED_ERRORS_SYMBOL];
    const path = responsePathAsArray(info.path);
    const combinedFieldSubschemaMap = object[FIELD_SUBSCHEMA_MAP_SYMBOL];
    await Promise.all([...delegationMap.entries()].map(async ([subschema, selectionSet]) => {
        var _a;
        const schema = subschema.transformedSchema || info.schema;
        const type = schema.getType(object.__typename);
        const resolver = mergedTypeInfo.resolvers.get(subschema);
        if (resolver) {
            let source;
            try {
                source = await resolver(object, context, info, subschema, selectionSet, undefined, type);
            }
            catch (error) {
                source = error;
            }
            if (source instanceof Error || source == null) {
                const fieldNodeResponseKeyMap = collectFields(schema, EMPTY_OBJECT, EMPTY_OBJECT, type, selectionSet, new Map(), new Set());
                const nullResult = {};
                for (const [responseKey, fieldNodes] of fieldNodeResponseKeyMap) {
                    const combinedPath = [...path, responseKey];
                    if (source instanceof GraphQLError) {
                        nullResult[responseKey] = relocatedError(source, combinedPath);
                    }
                    else if (source instanceof Error) {
                        nullResult[responseKey] = locatedError(source, fieldNodes, combinedPath);
                    }
                    else {
                        nullResult[responseKey] = null;
                    }
                }
                source = nullResult;
            }
            else {
                if (source[UNPATHED_ERRORS_SYMBOL]) {
                    combinedErrors.push(...source[UNPATHED_ERRORS_SYMBOL]);
                }
            }
            const objectSubschema = source[OBJECT_SUBSCHEMA_SYMBOL];
            const fieldSubschemaMap = source[FIELD_SUBSCHEMA_MAP_SYMBOL];
            for (const responseKey in source) {
                object[responseKey] = source[responseKey];
                combinedFieldSubschemaMap[responseKey] = (_a = fieldSubschemaMap === null || fieldSubschemaMap === void 0 ? void 0 : fieldSubschemaMap[responseKey]) !== null && _a !== void 0 ? _a : objectSubschema;
            }
        }
    }));
}
