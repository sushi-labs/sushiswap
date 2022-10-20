import { getNamedType, getNullableType, isInterfaceType, isListType, isObjectType, isUnionType, Kind, parseValue, print, valueFromASTUntyped, } from 'graphql';
import { cloneSubschemaConfig } from '@graphql-tools/delegate';
import { getDirective, getImplementingTypes, MapperKind, mapSchema, mergeDeep, parseSelectionSet, } from '@graphql-tools/utils';
import { defaultStitchingDirectiveOptions } from './defaultStitchingDirectiveOptions.js';
import { parseMergeArgsExpr } from './parseMergeArgsExpr.js';
import { addProperty, getProperty, getProperties } from './properties.js';
import { stitchingDirectivesValidator } from './stitchingDirectivesValidator.js';
export function stitchingDirectivesTransformer(options = {}) {
    const { keyDirectiveName, computedDirectiveName, mergeDirectiveName, canonicalDirectiveName, pathToDirectivesInExtensions, } = {
        ...defaultStitchingDirectiveOptions,
        ...options,
    };
    return (subschemaConfig) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const newSubschemaConfig = cloneSubschemaConfig(subschemaConfig);
        const selectionSetsByType = Object.create(null);
        const computedFieldSelectionSets = Object.create(null);
        const mergedTypesResolversInfo = Object.create(null);
        const canonicalTypesInfo = Object.create(null);
        const schema = subschemaConfig.schema;
        // gateway should also run validation
        stitchingDirectivesValidator(options)(schema);
        function setCanonicalDefinition(typeName, fieldName) {
            var _a;
            canonicalTypesInfo[typeName] = canonicalTypesInfo[typeName] || Object.create(null);
            if (fieldName) {
                const fields = (_a = canonicalTypesInfo[typeName].fields) !== null && _a !== void 0 ? _a : Object.create(null);
                canonicalTypesInfo[typeName].fields = fields;
                fields[fieldName] = true;
            }
            else {
                canonicalTypesInfo[typeName].canonical = true;
            }
        }
        mapSchema(schema, {
            [MapperKind.OBJECT_TYPE]: type => {
                var _a, _b;
                const keyDirective = (_a = getDirective(schema, type, keyDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (keyDirective != null) {
                    const selectionSet = parseSelectionSet(keyDirective['selectionSet'], { noLocation: true });
                    selectionSetsByType[type.name] = selectionSet;
                }
                const canonicalDirective = (_b = getDirective(schema, type, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _b === void 0 ? void 0 : _b[0];
                if (canonicalDirective != null) {
                    setCanonicalDefinition(type.name);
                }
                return undefined;
            },
            [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
                var _a, _b, _c;
                const computedDirective = (_a = getDirective(schema, fieldConfig, computedDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (computedDirective != null) {
                    const selectionSet = parseSelectionSet(computedDirective['selectionSet'], { noLocation: true });
                    if (!computedFieldSelectionSets[typeName]) {
                        computedFieldSelectionSets[typeName] = Object.create(null);
                    }
                    computedFieldSelectionSets[typeName][fieldName] = selectionSet;
                }
                const mergeDirective = (_b = getDirective(schema, fieldConfig, mergeDirectiveName, pathToDirectivesInExtensions)) === null || _b === void 0 ? void 0 : _b[0];
                if ((mergeDirective === null || mergeDirective === void 0 ? void 0 : mergeDirective['keyField']) != null) {
                    const mergeDirectiveKeyField = mergeDirective['keyField'];
                    const selectionSet = parseSelectionSet(`{ ${mergeDirectiveKeyField}}`, { noLocation: true });
                    const typeNames = mergeDirective['types'];
                    const returnType = getNamedType(fieldConfig.type);
                    forEachConcreteType(schema, returnType, typeNames, typeName => {
                        if (typeNames == null || typeNames.includes(typeName)) {
                            const existingSelectionSet = selectionSetsByType[typeName];
                            selectionSetsByType[typeName] = existingSelectionSet
                                ? mergeSelectionSets(existingSelectionSet, selectionSet)
                                : selectionSet;
                        }
                    });
                }
                const canonicalDirective = (_c = getDirective(schema, fieldConfig, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _c === void 0 ? void 0 : _c[0];
                if (canonicalDirective != null) {
                    setCanonicalDefinition(typeName, fieldName);
                }
                return undefined;
            },
            [MapperKind.INTERFACE_TYPE]: type => {
                var _a;
                const canonicalDirective = (_a = getDirective(schema, type, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (canonicalDirective) {
                    setCanonicalDefinition(type.name);
                }
                return undefined;
            },
            [MapperKind.INTERFACE_FIELD]: (fieldConfig, fieldName, typeName) => {
                var _a;
                const canonicalDirective = (_a = getDirective(schema, fieldConfig, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (canonicalDirective) {
                    setCanonicalDefinition(typeName, fieldName);
                }
                return undefined;
            },
            [MapperKind.INPUT_OBJECT_TYPE]: type => {
                var _a;
                const canonicalDirective = (_a = getDirective(schema, type, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (canonicalDirective) {
                    setCanonicalDefinition(type.name);
                }
                return undefined;
            },
            [MapperKind.INPUT_OBJECT_FIELD]: (inputFieldConfig, fieldName, typeName) => {
                var _a;
                const canonicalDirective = (_a = getDirective(schema, inputFieldConfig, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (canonicalDirective != null) {
                    setCanonicalDefinition(typeName, fieldName);
                }
                return undefined;
            },
            [MapperKind.UNION_TYPE]: type => {
                var _a;
                const canonicalDirective = (_a = getDirective(schema, type, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (canonicalDirective != null) {
                    setCanonicalDefinition(type.name);
                }
                return undefined;
            },
            [MapperKind.ENUM_TYPE]: type => {
                var _a;
                const canonicalDirective = (_a = getDirective(schema, type, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (canonicalDirective != null) {
                    setCanonicalDefinition(type.name);
                }
                return undefined;
            },
            [MapperKind.SCALAR_TYPE]: type => {
                var _a;
                const canonicalDirective = (_a = getDirective(schema, type, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (canonicalDirective != null) {
                    setCanonicalDefinition(type.name);
                }
                return undefined;
            },
        });
        if (subschemaConfig.merge) {
            for (const typeName in subschemaConfig.merge) {
                const mergedTypeConfig = subschemaConfig.merge[typeName];
                if (mergedTypeConfig.selectionSet) {
                    const selectionSet = parseSelectionSet(mergedTypeConfig.selectionSet, { noLocation: true });
                    if (selectionSet) {
                        if (selectionSetsByType[typeName]) {
                            selectionSetsByType[typeName] = mergeSelectionSets(selectionSetsByType[typeName], selectionSet);
                        }
                        else {
                            selectionSetsByType[typeName] = selectionSet;
                        }
                    }
                }
                if (mergedTypeConfig.fields) {
                    for (const fieldName in mergedTypeConfig.fields) {
                        const fieldConfig = mergedTypeConfig.fields[fieldName];
                        if (!fieldConfig.selectionSet)
                            continue;
                        const selectionSet = parseSelectionSet(fieldConfig.selectionSet, { noLocation: true });
                        if (selectionSet) {
                            if ((_a = computedFieldSelectionSets[typeName]) === null || _a === void 0 ? void 0 : _a[fieldName]) {
                                computedFieldSelectionSets[typeName][fieldName] = mergeSelectionSets(computedFieldSelectionSets[typeName][fieldName], selectionSet);
                            }
                            else {
                                if (computedFieldSelectionSets[typeName] == null) {
                                    computedFieldSelectionSets[typeName] = Object.create(null);
                                }
                                computedFieldSelectionSets[typeName][fieldName] = selectionSet;
                            }
                        }
                    }
                }
            }
        }
        const allSelectionSetsByType = Object.create(null);
        for (const typeName in selectionSetsByType) {
            allSelectionSetsByType[typeName] = allSelectionSetsByType[typeName] || [];
            const selectionSet = selectionSetsByType[typeName];
            allSelectionSetsByType[typeName].push(selectionSet);
        }
        for (const typeName in computedFieldSelectionSets) {
            const selectionSets = computedFieldSelectionSets[typeName];
            for (const i in selectionSets) {
                allSelectionSetsByType[typeName] = allSelectionSetsByType[typeName] || [];
                const selectionSet = selectionSets[i];
                allSelectionSetsByType[typeName].push(selectionSet);
            }
        }
        mapSchema(schema, {
            [MapperKind.OBJECT_FIELD]: function objectFieldMapper(fieldConfig, fieldName) {
                var _a, _b;
                const mergeDirective = (_a = getDirective(schema, fieldConfig, mergeDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (mergeDirective != null) {
                    const returnType = getNullableType(fieldConfig.type);
                    const returnsList = isListType(returnType);
                    const namedType = getNamedType(returnType);
                    let mergeArgsExpr = mergeDirective['argsExpr'];
                    if (mergeArgsExpr == null) {
                        const key = mergeDirective['key'];
                        const keyField = mergeDirective['keyField'];
                        const keyExpr = key != null ? buildKeyExpr(key) : keyField != null ? `$key.${keyField}` : '$key';
                        const keyArg = mergeDirective['keyArg'];
                        const argNames = keyArg == null ? [Object.keys((_b = fieldConfig.args) !== null && _b !== void 0 ? _b : {})[0]] : keyArg.split('.');
                        const lastArgName = argNames.pop();
                        mergeArgsExpr = returnsList ? `${lastArgName}: [[${keyExpr}]]` : `${lastArgName}: ${keyExpr}`;
                        for (const argName of argNames.reverse()) {
                            mergeArgsExpr = `${argName}: { ${mergeArgsExpr} }`;
                        }
                    }
                    const typeNames = mergeDirective['types'];
                    forEachConcreteTypeName(namedType, schema, typeNames, function generateResolveInfo(typeName) {
                        const parsedMergeArgsExpr = parseMergeArgsExpr(mergeArgsExpr, allSelectionSetsByType[typeName] == null
                            ? undefined
                            : mergeSelectionSets(...allSelectionSetsByType[typeName]));
                        const additionalArgs = mergeDirective['additionalArgs'];
                        if (additionalArgs != null) {
                            parsedMergeArgsExpr.args = mergeDeep([
                                parsedMergeArgsExpr.args,
                                valueFromASTUntyped(parseValue(`{ ${additionalArgs} }`, { noLocation: true })),
                            ]);
                        }
                        mergedTypesResolversInfo[typeName] = {
                            fieldName,
                            returnsList,
                            ...parsedMergeArgsExpr,
                        };
                    });
                }
                return undefined;
            },
        });
        for (const typeName in selectionSetsByType) {
            const selectionSet = selectionSetsByType[typeName];
            const mergeConfig = (_b = newSubschemaConfig.merge) !== null && _b !== void 0 ? _b : Object.create(null);
            newSubschemaConfig.merge = mergeConfig;
            if (mergeConfig[typeName] == null) {
                newSubschemaConfig.merge[typeName] = Object.create(null);
            }
            const mergeTypeConfig = mergeConfig[typeName];
            mergeTypeConfig.selectionSet = print(selectionSet);
        }
        for (const typeName in computedFieldSelectionSets) {
            const selectionSets = computedFieldSelectionSets[typeName];
            const mergeConfig = (_c = newSubschemaConfig.merge) !== null && _c !== void 0 ? _c : Object.create(null);
            newSubschemaConfig.merge = mergeConfig;
            if (mergeConfig[typeName] == null) {
                mergeConfig[typeName] = Object.create(null);
            }
            const mergeTypeConfig = newSubschemaConfig.merge[typeName];
            const mergeTypeConfigFields = (_d = mergeTypeConfig.fields) !== null && _d !== void 0 ? _d : Object.create(null);
            mergeTypeConfig.fields = mergeTypeConfigFields;
            for (const fieldName in selectionSets) {
                const selectionSet = selectionSets[fieldName];
                const fieldConfig = (_e = mergeTypeConfigFields[fieldName]) !== null && _e !== void 0 ? _e : Object.create(null);
                mergeTypeConfigFields[fieldName] = fieldConfig;
                fieldConfig.selectionSet = print(selectionSet);
                fieldConfig.computed = true;
            }
        }
        for (const typeName in mergedTypesResolversInfo) {
            const mergedTypeResolverInfo = mergedTypesResolversInfo[typeName];
            const mergeConfig = (_f = newSubschemaConfig.merge) !== null && _f !== void 0 ? _f : Object.create(null);
            newSubschemaConfig.merge = mergeConfig;
            if (newSubschemaConfig.merge[typeName] == null) {
                newSubschemaConfig.merge[typeName] = Object.create(null);
            }
            const mergeTypeConfig = newSubschemaConfig.merge[typeName];
            mergeTypeConfig.fieldName = mergedTypeResolverInfo.fieldName;
            if (mergedTypeResolverInfo.returnsList) {
                mergeTypeConfig.key = generateKeyFn(mergedTypeResolverInfo);
                mergeTypeConfig.argsFromKeys = generateArgsFromKeysFn(mergedTypeResolverInfo);
            }
            else {
                mergeTypeConfig.args = generateArgsFn(mergedTypeResolverInfo);
            }
        }
        for (const typeName in canonicalTypesInfo) {
            const canonicalTypeInfo = canonicalTypesInfo[typeName];
            const mergeConfig = (_g = newSubschemaConfig.merge) !== null && _g !== void 0 ? _g : Object.create(null);
            newSubschemaConfig.merge = mergeConfig;
            if (newSubschemaConfig.merge[typeName] == null) {
                newSubschemaConfig.merge[typeName] = Object.create(null);
            }
            const mergeTypeConfig = newSubschemaConfig.merge[typeName];
            if (canonicalTypeInfo.canonical) {
                mergeTypeConfig.canonical = true;
            }
            if (canonicalTypeInfo.fields) {
                const mergeTypeConfigFields = (_h = mergeTypeConfig.fields) !== null && _h !== void 0 ? _h : Object.create(null);
                mergeTypeConfig.fields = mergeTypeConfigFields;
                for (const fieldName in canonicalTypeInfo.fields) {
                    if (mergeTypeConfigFields[fieldName] == null) {
                        mergeTypeConfigFields[fieldName] = Object.create(null);
                    }
                    mergeTypeConfigFields[fieldName].canonical = true;
                }
            }
        }
        return newSubschemaConfig;
    };
}
function forEachConcreteType(schema, type, typeNames, fn) {
    if (isInterfaceType(type)) {
        for (const typeName of getImplementingTypes(type.name, schema)) {
            if (typeNames == null || typeNames.includes(typeName)) {
                fn(typeName);
            }
        }
    }
    else if (isUnionType(type)) {
        for (const { name: typeName } of type.getTypes()) {
            if (typeNames == null || typeNames.includes(typeName)) {
                fn(typeName);
            }
        }
    }
    else if (isObjectType(type)) {
        fn(type.name);
    }
}
function generateKeyFn(mergedTypeResolverInfo) {
    return function keyFn(originalResult) {
        return getProperties(originalResult, mergedTypeResolverInfo.usedProperties);
    };
}
function generateArgsFromKeysFn(mergedTypeResolverInfo) {
    const { expansions, args } = mergedTypeResolverInfo;
    return function generateArgsFromKeys(keys) {
        const newArgs = mergeDeep([{}, args]);
        if (expansions) {
            for (const expansion of expansions) {
                const mappingInstructions = expansion.mappingInstructions;
                const expanded = [];
                for (const key of keys) {
                    let newValue = mergeDeep([{}, expansion.valuePath]);
                    for (const { destinationPath, sourcePath } of mappingInstructions) {
                        if (destinationPath.length) {
                            addProperty(newValue, destinationPath, getProperty(key, sourcePath));
                        }
                        else {
                            newValue = getProperty(key, sourcePath);
                        }
                    }
                    expanded.push(newValue);
                }
                addProperty(newArgs, expansion.valuePath, expanded);
            }
        }
        return newArgs;
    };
}
function generateArgsFn(mergedTypeResolverInfo) {
    const { mappingInstructions, args, usedProperties } = mergedTypeResolverInfo;
    return function generateArgs(originalResult) {
        const newArgs = mergeDeep([{}, args]);
        const filteredResult = getProperties(originalResult, usedProperties);
        if (mappingInstructions) {
            for (const mappingInstruction of mappingInstructions) {
                const { destinationPath, sourcePath } = mappingInstruction;
                addProperty(newArgs, destinationPath, getProperty(filteredResult, sourcePath));
            }
        }
        return newArgs;
    };
}
function buildKeyExpr(key) {
    let mergedObject = {};
    for (const keyDef of key) {
        let [aliasOrKeyPath, keyPath] = keyDef.split(':');
        let aliasPath;
        if (keyPath == null) {
            keyPath = aliasPath = aliasOrKeyPath;
        }
        else {
            aliasPath = aliasOrKeyPath;
        }
        const aliasParts = aliasPath.split('.');
        const lastAliasPart = aliasParts.pop();
        if (lastAliasPart == null) {
            throw new Error(`Key "${key}" is invalid, no path provided.`);
        }
        let object = { [lastAliasPart]: `$key.${keyPath}` };
        for (const aliasPart of aliasParts.reverse()) {
            object = { [aliasPart]: object };
        }
        mergedObject = mergeDeep([mergedObject, object]);
    }
    return JSON.stringify(mergedObject).replace(/"/g, '');
}
function mergeSelectionSets(...selectionSets) {
    const normalizedSelections = Object.create(null);
    for (const selectionSet of selectionSets) {
        for (const selection of selectionSet.selections) {
            const normalizedSelection = print(selection);
            normalizedSelections[normalizedSelection] = selection;
        }
    }
    const newSelectionSet = {
        kind: Kind.SELECTION_SET,
        selections: Object.values(normalizedSelections),
    };
    return newSelectionSet;
}
function forEachConcreteTypeName(returnType, schema, typeNames, fn) {
    if (isInterfaceType(returnType)) {
        for (const typeName of getImplementingTypes(returnType.name, schema)) {
            if (typeNames == null || typeNames.includes(typeName)) {
                fn(typeName);
            }
        }
    }
    else if (isUnionType(returnType)) {
        for (const type of returnType.getTypes()) {
            if (typeNames == null || typeNames.includes(type.name)) {
                fn(type.name);
            }
        }
    }
    else if (isObjectType(returnType) && (typeNames == null || typeNames.includes(returnType.name))) {
        fn(returnType.name);
    }
}
