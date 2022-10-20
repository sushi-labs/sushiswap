import { Kind, isObjectType, getNamedType, print, isInterfaceType, isLeafType, isInputObjectType, isUnionType, } from 'graphql';
import { collectFields, parseSelectionSet, isSome } from '@graphql-tools/utils';
import { createMergedTypeResolver } from './createMergedTypeResolver.js';
import { createDelegationPlanBuilder } from './createDelegationPlanBuilder.js';
import { ValueOrPromise } from 'value-or-promise';
export function createStitchingInfo(subschemaMap, typeCandidates, mergeTypes) {
    const mergedTypes = createMergedTypes(typeCandidates, mergeTypes);
    return {
        subschemaMap,
        fieldNodesByType: Object.create(null),
        fieldNodesByField: Object.create(null),
        dynamicSelectionSetsByField: Object.create(null),
        mergedTypes,
    };
}
function createMergedTypes(typeCandidates, mergeTypes) {
    var _a, _b;
    const mergedTypes = Object.create(null);
    for (const typeName in typeCandidates) {
        if (typeCandidates[typeName].length > 1 &&
            (isObjectType(typeCandidates[typeName][0].type) || isInterfaceType(typeCandidates[typeName][0].type))) {
            const typeCandidatesWithMergedTypeConfig = typeCandidates[typeName].filter(typeCandidate => typeCandidate.transformedSubschema != null &&
                typeCandidate.transformedSubschema.merge != null &&
                typeName in typeCandidate.transformedSubschema.merge);
            if (mergeTypes === true ||
                (typeof mergeTypes === 'function' && mergeTypes(typeCandidates[typeName], typeName)) ||
                (Array.isArray(mergeTypes) && mergeTypes.includes(typeName)) ||
                typeCandidatesWithMergedTypeConfig.length) {
                const targetSubschemas = [];
                const typeMaps = new Map();
                const supportedBySubschemas = Object.create({});
                const selectionSets = new Map();
                const fieldSelectionSets = new Map();
                const resolvers = new Map();
                for (const typeCandidate of typeCandidates[typeName]) {
                    const subschema = typeCandidate.transformedSubschema;
                    if (subschema == null) {
                        continue;
                    }
                    typeMaps.set(subschema, subschema.transformedSchema.getTypeMap());
                    const mergedTypeConfig = (_a = subschema === null || subschema === void 0 ? void 0 : subschema.merge) === null || _a === void 0 ? void 0 : _a[typeName];
                    if (mergedTypeConfig == null) {
                        continue;
                    }
                    if (mergedTypeConfig.selectionSet) {
                        const selectionSet = parseSelectionSet(mergedTypeConfig.selectionSet, { noLocation: true });
                        selectionSets.set(subschema, selectionSet);
                    }
                    if (mergedTypeConfig.fields) {
                        const parsedFieldSelectionSets = Object.create(null);
                        for (const fieldName in mergedTypeConfig.fields) {
                            if (mergedTypeConfig.fields[fieldName].selectionSet) {
                                const rawFieldSelectionSet = mergedTypeConfig.fields[fieldName].selectionSet;
                                parsedFieldSelectionSets[fieldName] = rawFieldSelectionSet
                                    ? parseSelectionSet(rawFieldSelectionSet, { noLocation: true })
                                    : undefined;
                            }
                        }
                        fieldSelectionSets.set(subschema, parsedFieldSelectionSets);
                    }
                    const resolver = (_b = mergedTypeConfig.resolve) !== null && _b !== void 0 ? _b : createMergedTypeResolver(mergedTypeConfig);
                    if (resolver == null) {
                        continue;
                    }
                    const keyFn = mergedTypeConfig.key;
                    resolvers.set(subschema, keyFn
                        ? function batchMergedTypeResolverWrapper(originalResult, context, info, subschema, selectionSet, type) {
                            return new ValueOrPromise(() => keyFn(originalResult))
                                .then(key => resolver(originalResult, context, info, subschema, selectionSet, key, type))
                                .resolve();
                        }
                        : resolver);
                    targetSubschemas.push(subschema);
                    const type = subschema.transformedSchema.getType(typeName);
                    const fieldMap = type.getFields();
                    const selectionSet = selectionSets.get(subschema);
                    for (const fieldName in fieldMap) {
                        const field = fieldMap[fieldName];
                        const fieldType = getNamedType(field.type);
                        if (selectionSet && isLeafType(fieldType) && selectionSetContainsTopLevelField(selectionSet, fieldName)) {
                            continue;
                        }
                        if (!(fieldName in supportedBySubschemas)) {
                            supportedBySubschemas[fieldName] = [];
                        }
                        supportedBySubschemas[fieldName].push(subschema);
                    }
                }
                const sourceSubschemas = typeCandidates[typeName]
                    .map(typeCandidate => typeCandidate === null || typeCandidate === void 0 ? void 0 : typeCandidate.transformedSubschema)
                    .filter(isSome);
                const targetSubschemasBySubschema = new Map();
                for (const subschema of sourceSubschemas) {
                    const filteredSubschemas = targetSubschemas.filter(s => s !== subschema);
                    if (filteredSubschemas.length) {
                        targetSubschemasBySubschema.set(subschema, filteredSubschemas);
                    }
                }
                mergedTypes[typeName] = {
                    typeName,
                    targetSubschemas: targetSubschemasBySubschema,
                    typeMaps,
                    selectionSets,
                    fieldSelectionSets,
                    uniqueFields: Object.create({}),
                    nonUniqueFields: Object.create({}),
                    resolvers,
                };
                mergedTypes[typeName].delegationPlanBuilder = createDelegationPlanBuilder(mergedTypes[typeName]);
                for (const fieldName in supportedBySubschemas) {
                    if (supportedBySubschemas[fieldName].length === 1) {
                        mergedTypes[typeName].uniqueFields[fieldName] = supportedBySubschemas[fieldName][0];
                    }
                    else {
                        mergedTypes[typeName].nonUniqueFields[fieldName] = supportedBySubschemas[fieldName];
                    }
                }
            }
        }
    }
    return mergedTypes;
}
export function completeStitchingInfo(stitchingInfo, resolvers, schema) {
    const { fieldNodesByType, fieldNodesByField, dynamicSelectionSetsByField, mergedTypes } = stitchingInfo;
    // must add __typename to query and mutation root types to handle type merging with nested root types
    // cannot add __typename to subscription root types, but they cannot be nested
    const rootTypes = [schema.getQueryType(), schema.getMutationType()];
    for (const rootType of rootTypes) {
        if (rootType) {
            fieldNodesByType[rootType.name] = [
                parseSelectionSet('{ __typename }', { noLocation: true }).selections[0],
            ];
        }
    }
    const selectionSetsByField = Object.create(null);
    for (const typeName in mergedTypes) {
        const mergedTypeInfo = mergedTypes[typeName];
        if (mergedTypeInfo.selectionSets == null && mergedTypeInfo.fieldSelectionSets == null) {
            continue;
        }
        for (const [subschemaConfig, selectionSet] of mergedTypeInfo.selectionSets) {
            const schema = subschemaConfig.transformedSchema;
            const type = schema.getType(typeName);
            const fields = type.getFields();
            for (const fieldName in fields) {
                const field = fields[fieldName];
                const fieldType = getNamedType(field.type);
                if (selectionSet && isLeafType(fieldType) && selectionSetContainsTopLevelField(selectionSet, fieldName)) {
                    continue;
                }
                updateSelectionSetMap(selectionSetsByField, typeName, fieldName, selectionSet, true);
            }
        }
        for (const [, selectionSetFieldMap] of mergedTypeInfo.fieldSelectionSets) {
            for (const fieldName in selectionSetFieldMap) {
                const selectionSet = selectionSetFieldMap[fieldName];
                updateSelectionSetMap(selectionSetsByField, typeName, fieldName, selectionSet, true);
            }
        }
    }
    for (const typeName in resolvers) {
        const type = schema.getType(typeName);
        if (type === undefined || isLeafType(type) || isInputObjectType(type) || isUnionType(type)) {
            continue;
        }
        const resolver = resolvers[typeName];
        for (const fieldName in resolver) {
            const field = resolver[fieldName];
            if (typeof field.selectionSet === 'function') {
                if (!(typeName in dynamicSelectionSetsByField)) {
                    dynamicSelectionSetsByField[typeName] = Object.create(null);
                }
                if (!(fieldName in dynamicSelectionSetsByField[typeName])) {
                    dynamicSelectionSetsByField[typeName][fieldName] = [];
                }
                dynamicSelectionSetsByField[typeName][fieldName].push(field.selectionSet);
            }
            else if (field.selectionSet) {
                const selectionSet = parseSelectionSet(field.selectionSet, { noLocation: true });
                updateSelectionSetMap(selectionSetsByField, typeName, fieldName, selectionSet);
            }
        }
    }
    const variableValues = Object.create(null);
    const fragments = Object.create(null);
    const fieldNodeMap = Object.create(null);
    for (const typeName in selectionSetsByField) {
        const type = schema.getType(typeName);
        for (const fieldName in selectionSetsByField[typeName]) {
            for (const selectionSet of selectionSetsByField[typeName][fieldName]) {
                const fieldNodesByResponseKey = collectFields(schema, fragments, variableValues, type, selectionSet, new Map(), new Set());
                for (const [, fieldNodes] of fieldNodesByResponseKey) {
                    for (const fieldNode of fieldNodes) {
                        const key = print(fieldNode);
                        if (fieldNodeMap[key] == null) {
                            fieldNodeMap[key] = fieldNode;
                            updateArrayMap(fieldNodesByField, typeName, fieldName, fieldNode);
                        }
                        else {
                            updateArrayMap(fieldNodesByField, typeName, fieldName, fieldNodeMap[key]);
                        }
                    }
                }
            }
        }
    }
    return stitchingInfo;
}
function updateSelectionSetMap(map, typeName, fieldName, selectionSet, includeTypename) {
    if (includeTypename) {
        const typenameSelectionSet = parseSelectionSet('{ __typename }', { noLocation: true });
        updateArrayMap(map, typeName, fieldName, selectionSet, typenameSelectionSet);
        return;
    }
    updateArrayMap(map, typeName, fieldName, selectionSet);
}
function updateArrayMap(map, typeName, fieldName, value, initialValue) {
    if (map[typeName] == null) {
        const initialItems = initialValue === undefined ? [value] : [initialValue, value];
        map[typeName] = {
            [fieldName]: initialItems,
        };
    }
    else if (map[typeName][fieldName] == null) {
        const initialItems = initialValue === undefined ? [value] : [initialValue, value];
        map[typeName][fieldName] = initialItems;
    }
    else {
        map[typeName][fieldName].push(value);
    }
}
export function addStitchingInfo(stitchedSchema, stitchingInfo) {
    stitchedSchema.extensions = {
        ...stitchedSchema.extensions,
        stitchingInfo,
    };
}
export function selectionSetContainsTopLevelField(selectionSet, fieldName) {
    return selectionSet.selections.some(selection => selection.kind === Kind.FIELD && selection.name.value === fieldName);
}
