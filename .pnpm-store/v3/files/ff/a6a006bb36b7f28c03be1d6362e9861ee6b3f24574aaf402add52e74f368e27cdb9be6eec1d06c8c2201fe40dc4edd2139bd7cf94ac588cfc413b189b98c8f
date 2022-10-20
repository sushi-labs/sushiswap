"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDelegationPlanBuilder = void 0;
const graphql_1 = require("graphql");
const getFieldsNotInSubschema_js_1 = require("./getFieldsNotInSubschema.js");
const utils_1 = require("@graphql-tools/utils");
function calculateDelegationStage(mergedTypeInfo, sourceSubschemas, targetSubschemas, fieldNodes) {
    var _a;
    const { selectionSets, fieldSelectionSets, uniqueFields, nonUniqueFields } = mergedTypeInfo;
    // 1.  calculate if possible to delegate to given subschema
    const proxiableSubschemas = [];
    const nonProxiableSubschemas = [];
    for (const t of targetSubschemas) {
        const selectionSet = selectionSets.get(t);
        const fieldSelectionSetsMap = fieldSelectionSets.get(t);
        if (selectionSet != null && !subschemaTypesContainSelectionSet(mergedTypeInfo, sourceSubschemas, selectionSet)) {
            nonProxiableSubschemas.push(t);
        }
        else {
            if (fieldSelectionSetsMap == null ||
                fieldNodes.every(fieldNode => {
                    const fieldName = fieldNode.name.value;
                    const fieldSelectionSet = fieldSelectionSetsMap[fieldName];
                    return (fieldSelectionSet == null ||
                        subschemaTypesContainSelectionSet(mergedTypeInfo, sourceSubschemas, fieldSelectionSet));
                })) {
                proxiableSubschemas.push(t);
            }
            else {
                nonProxiableSubschemas.push(t);
            }
        }
    }
    const unproxiableFieldNodes = [];
    // 2. for each selection:
    const delegationMap = new Map();
    for (const fieldNode of fieldNodes) {
        if (fieldNode.name.value === '__typename') {
            continue;
        }
        // 2a. use uniqueFields map to assign fields to subschema if one of possible subschemas
        const uniqueSubschema = uniqueFields[fieldNode.name.value];
        if (uniqueSubschema != null) {
            if (!proxiableSubschemas.includes(uniqueSubschema)) {
                unproxiableFieldNodes.push(fieldNode);
                continue;
            }
            const existingSubschema = (_a = delegationMap.get(uniqueSubschema)) === null || _a === void 0 ? void 0 : _a.selections;
            if (existingSubschema != null) {
                existingSubschema.push(fieldNode);
            }
            else {
                delegationMap.set(uniqueSubschema, {
                    kind: graphql_1.Kind.SELECTION_SET,
                    selections: [fieldNode],
                });
            }
            continue;
        }
        // 2b. use nonUniqueFields to assign to a possible subschema,
        //     preferring one of the subschemas already targets of delegation
        let nonUniqueSubschemas = nonUniqueFields[fieldNode.name.value];
        if (nonUniqueSubschemas == null) {
            unproxiableFieldNodes.push(fieldNode);
            continue;
        }
        nonUniqueSubschemas = nonUniqueSubschemas.filter(s => proxiableSubschemas.includes(s));
        if (!nonUniqueSubschemas.length) {
            unproxiableFieldNodes.push(fieldNode);
            continue;
        }
        const existingSubschema = nonUniqueSubschemas.find(s => delegationMap.has(s));
        if (existingSubschema != null) {
            // It is okay we previously explicitly check whether the map has the element.
            delegationMap.get(existingSubschema).selections.push(fieldNode);
        }
        else {
            delegationMap.set(nonUniqueSubschemas[0], {
                kind: graphql_1.Kind.SELECTION_SET,
                selections: [fieldNode],
            });
        }
    }
    return {
        delegationMap,
        proxiableSubschemas,
        nonProxiableSubschemas,
        unproxiableFieldNodes,
    };
}
function getStitchingInfo(schema) {
    var _a;
    const stitchingInfo = (_a = schema.extensions) === null || _a === void 0 ? void 0 : _a['stitchingInfo'];
    if (!stitchingInfo) {
        throw new Error(`Schema is not a stitched schema.`);
    }
    return stitchingInfo;
}
function createDelegationPlanBuilder(mergedTypeInfo) {
    return (0, utils_1.memoize5)(function delegationPlanBuilder(schema, sourceSubschema, variableValues, fragments, fieldNodes) {
        var _a;
        const stitchingInfo = getStitchingInfo(schema);
        const targetSubschemas = mergedTypeInfo === null || mergedTypeInfo === void 0 ? void 0 : mergedTypeInfo.targetSubschemas.get(sourceSubschema);
        if (!targetSubschemas || !targetSubschemas.length) {
            return [];
        }
        const typeName = mergedTypeInfo.typeName;
        const fieldsNotInSubschema = (0, getFieldsNotInSubschema_js_1.getFieldsNotInSubschema)(schema, stitchingInfo, schema.getType(typeName), (_a = mergedTypeInfo.typeMaps.get(sourceSubschema)) === null || _a === void 0 ? void 0 : _a[typeName], fieldNodes, fragments, variableValues);
        if (!fieldsNotInSubschema.length) {
            return [];
        }
        const delegationMaps = [];
        let sourceSubschemas = createSubschemas(sourceSubschema);
        let delegationStage = calculateDelegationStage(mergedTypeInfo, sourceSubschemas, targetSubschemas, fieldsNotInSubschema);
        let { delegationMap } = delegationStage;
        while (delegationMap.size) {
            delegationMaps.push(delegationMap);
            const { proxiableSubschemas, nonProxiableSubschemas, unproxiableFieldNodes } = delegationStage;
            sourceSubschemas = combineSubschemas(sourceSubschemas, proxiableSubschemas);
            delegationStage = calculateDelegationStage(mergedTypeInfo, sourceSubschemas, nonProxiableSubschemas, unproxiableFieldNodes);
            delegationMap = delegationStage.delegationMap;
        }
        return delegationMaps;
    });
}
exports.createDelegationPlanBuilder = createDelegationPlanBuilder;
const createSubschemas = (0, utils_1.memoize1)(function createSubschemas(sourceSubschema) {
    return [sourceSubschema];
});
const combineSubschemas = (0, utils_1.memoize2)(function combineSubschemas(sourceSubschemas, additionalSubschemas) {
    return sourceSubschemas.concat(additionalSubschemas);
});
const subschemaTypesContainSelectionSet = (0, utils_1.memoize3)(function subschemaTypesContainSelectionSet(mergedTypeInfo, sourceSubchemas, selectionSet) {
    return typesContainSelectionSet(sourceSubchemas.map(sourceSubschema => sourceSubschema.transformedSchema.getType(mergedTypeInfo.typeName)), selectionSet);
});
function typesContainSelectionSet(types, selectionSet) {
    var _a;
    const fieldMaps = types.map(type => type.getFields());
    for (const selection of selectionSet.selections) {
        if (selection.kind === graphql_1.Kind.FIELD) {
            const fields = fieldMaps.map(fieldMap => fieldMap[selection.name.value]).filter(field => field != null);
            if (!fields.length) {
                return false;
            }
            if (selection.selectionSet != null) {
                return typesContainSelectionSet(fields.map(field => (0, graphql_1.getNamedType)(field.type)), selection.selectionSet);
            }
        }
        else if (selection.kind === graphql_1.Kind.INLINE_FRAGMENT && ((_a = selection.typeCondition) === null || _a === void 0 ? void 0 : _a.name.value) === types[0].name) {
            return typesContainSelectionSet(types, selection.selectionSet);
        }
    }
    return true;
}
