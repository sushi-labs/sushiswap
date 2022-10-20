"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeFields = exports.getUnpathedErrors = exports.getSubschema = exports.annotateExternalObject = exports.isExternalObject = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const symbols_js_1 = require("./symbols.js");
function isExternalObject(data) {
    return data[symbols_js_1.UNPATHED_ERRORS_SYMBOL] !== undefined;
}
exports.isExternalObject = isExternalObject;
function annotateExternalObject(object, errors, subschema, subschemaMap) {
    Object.defineProperties(object, {
        [symbols_js_1.OBJECT_SUBSCHEMA_SYMBOL]: { value: subschema },
        [symbols_js_1.FIELD_SUBSCHEMA_MAP_SYMBOL]: { value: subschemaMap },
        [symbols_js_1.UNPATHED_ERRORS_SYMBOL]: { value: errors },
    });
    return object;
}
exports.annotateExternalObject = annotateExternalObject;
function getSubschema(object, responseKey) {
    var _a;
    return (_a = object[symbols_js_1.FIELD_SUBSCHEMA_MAP_SYMBOL][responseKey]) !== null && _a !== void 0 ? _a : object[symbols_js_1.OBJECT_SUBSCHEMA_SYMBOL];
}
exports.getSubschema = getSubschema;
function getUnpathedErrors(object) {
    return object[symbols_js_1.UNPATHED_ERRORS_SYMBOL];
}
exports.getUnpathedErrors = getUnpathedErrors;
const EMPTY_ARRAY = [];
const EMPTY_OBJECT = Object.create(null);
async function mergeFields(mergedTypeInfo, object, sourceSubschema, context, info) {
    var _a;
    const delegationMaps = mergedTypeInfo.delegationPlanBuilder(info.schema, sourceSubschema, info.variableValues != null && Object.keys(info.variableValues).length > 0 ? info.variableValues : EMPTY_OBJECT, info.fragments != null && Object.keys(info.fragments).length > 0 ? info.fragments : EMPTY_OBJECT, ((_a = info.fieldNodes) === null || _a === void 0 ? void 0 : _a.length) ? info.fieldNodes : EMPTY_ARRAY);
    for (const delegationMap of delegationMaps) {
        await executeDelegationStage(mergedTypeInfo, delegationMap, object, context, info);
    }
    return object;
}
exports.mergeFields = mergeFields;
async function executeDelegationStage(mergedTypeInfo, delegationMap, object, context, info) {
    const combinedErrors = object[symbols_js_1.UNPATHED_ERRORS_SYMBOL];
    const path = (0, graphql_1.responsePathAsArray)(info.path);
    const combinedFieldSubschemaMap = object[symbols_js_1.FIELD_SUBSCHEMA_MAP_SYMBOL];
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
                const fieldNodeResponseKeyMap = (0, utils_1.collectFields)(schema, EMPTY_OBJECT, EMPTY_OBJECT, type, selectionSet, new Map(), new Set());
                const nullResult = {};
                for (const [responseKey, fieldNodes] of fieldNodeResponseKeyMap) {
                    const combinedPath = [...path, responseKey];
                    if (source instanceof graphql_1.GraphQLError) {
                        nullResult[responseKey] = (0, utils_1.relocatedError)(source, combinedPath);
                    }
                    else if (source instanceof Error) {
                        nullResult[responseKey] = (0, graphql_1.locatedError)(source, fieldNodes, combinedPath);
                    }
                    else {
                        nullResult[responseKey] = null;
                    }
                }
                source = nullResult;
            }
            else {
                if (source[symbols_js_1.UNPATHED_ERRORS_SYMBOL]) {
                    combinedErrors.push(...source[symbols_js_1.UNPATHED_ERRORS_SYMBOL]);
                }
            }
            const objectSubschema = source[symbols_js_1.OBJECT_SUBSCHEMA_SYMBOL];
            const fieldSubschemaMap = source[symbols_js_1.FIELD_SUBSCHEMA_MAP_SYMBOL];
            for (const responseKey in source) {
                object[responseKey] = source[responseKey];
                combinedFieldSubschemaMap[responseKey] = (_a = fieldSubschemaMap === null || fieldSubschemaMap === void 0 ? void 0 : fieldSubschemaMap[responseKey]) !== null && _a !== void 0 ? _a : objectSubschema;
            }
        }
    }));
}
