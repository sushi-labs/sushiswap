"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stitchingDirectivesTransformer = void 0;
const graphql_1 = require("graphql");
const delegate_1 = require("@graphql-tools/delegate");
const utils_1 = require("@graphql-tools/utils");
const defaultStitchingDirectiveOptions_js_1 = require("./defaultStitchingDirectiveOptions.js");
const parseMergeArgsExpr_js_1 = require("./parseMergeArgsExpr.js");
const properties_js_1 = require("./properties.js");
const stitchingDirectivesValidator_js_1 = require("./stitchingDirectivesValidator.js");
function stitchingDirectivesTransformer(options = {}) {
    const { keyDirectiveName, computedDirectiveName, mergeDirectiveName, canonicalDirectiveName, pathToDirectivesInExtensions, } = {
        ...defaultStitchingDirectiveOptions_js_1.defaultStitchingDirectiveOptions,
        ...options,
    };
    return (subschemaConfig) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const newSubschemaConfig = (0, delegate_1.cloneSubschemaConfig)(subschemaConfig);
        const selectionSetsByType = Object.create(null);
        const computedFieldSelectionSets = Object.create(null);
        const mergedTypesResolversInfo = Object.create(null);
        const canonicalTypesInfo = Object.create(null);
        const schema = subschemaConfig.schema;
        // gateway should also run validation
        (0, stitchingDirectivesValidator_js_1.stitchingDirectivesValidator)(options)(schema);
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
        (0, utils_1.mapSchema)(schema, {
            [utils_1.MapperKind.OBJECT_TYPE]: type => {
                var _a, _b;
                const keyDirective = (_a = (0, utils_1.getDirective)(schema, type, keyDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (keyDirective != null) {
                    const selectionSet = (0, utils_1.parseSelectionSet)(keyDirective['selectionSet'], { noLocation: true });
                    selectionSetsByType[type.name] = selectionSet;
                }
                const canonicalDirective = (_b = (0, utils_1.getDirective)(schema, type, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _b === void 0 ? void 0 : _b[0];
                if (canonicalDirective != null) {
                    setCanonicalDefinition(type.name);
                }
                return undefined;
            },
            [utils_1.MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
                var _a, _b, _c;
                const computedDirective = (_a = (0, utils_1.getDirective)(schema, fieldConfig, computedDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (computedDirective != null) {
                    const selectionSet = (0, utils_1.parseSelectionSet)(computedDirective['selectionSet'], { noLocation: true });
                    if (!computedFieldSelectionSets[typeName]) {
                        computedFieldSelectionSets[typeName] = Object.create(null);
                    }
                    computedFieldSelectionSets[typeName][fieldName] = selectionSet;
                }
                const mergeDirective = (_b = (0, utils_1.getDirective)(schema, fieldConfig, mergeDirectiveName, pathToDirectivesInExtensions)) === null || _b === void 0 ? void 0 : _b[0];
                if ((mergeDirective === null || mergeDirective === void 0 ? void 0 : mergeDirective['keyField']) != null) {
                    const mergeDirectiveKeyField = mergeDirective['keyField'];
                    const selectionSet = (0, utils_1.parseSelectionSet)(`{ ${mergeDirectiveKeyField}}`, { noLocation: true });
                    const typeNames = mergeDirective['types'];
                    const returnType = (0, graphql_1.getNamedType)(fieldConfig.type);
                    forEachConcreteType(schema, returnType, typeNames, typeName => {
                        if (typeNames == null || typeNames.includes(typeName)) {
                            const existingSelectionSet = selectionSetsByType[typeName];
                            selectionSetsByType[typeName] = existingSelectionSet
                                ? mergeSelectionSets(existingSelectionSet, selectionSet)
                                : selectionSet;
                        }
                    });
                }
                const canonicalDirective = (_c = (0, utils_1.getDirective)(schema, fieldConfig, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _c === void 0 ? void 0 : _c[0];
                if (canonicalDirective != null) {
                    setCanonicalDefinition(typeName, fieldName);
                }
                return undefined;
            },
            [utils_1.MapperKind.INTERFACE_TYPE]: type => {
                var _a;
                const canonicalDirective = (_a = (0, utils_1.getDirective)(schema, type, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (canonicalDirective) {
                    setCanonicalDefinition(type.name);
                }
                return undefined;
            },
            [utils_1.MapperKind.INTERFACE_FIELD]: (fieldConfig, fieldName, typeName) => {
                var _a;
                const canonicalDirective = (_a = (0, utils_1.getDirective)(schema, fieldConfig, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (canonicalDirective) {
                    setCanonicalDefinition(typeName, fieldName);
                }
                return undefined;
            },
            [utils_1.MapperKind.INPUT_OBJECT_TYPE]: type => {
                var _a;
                const canonicalDirective = (_a = (0, utils_1.getDirective)(schema, type, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (canonicalDirective) {
                    setCanonicalDefinition(type.name);
                }
                return undefined;
            },
            [utils_1.MapperKind.INPUT_OBJECT_FIELD]: (inputFieldConfig, fieldName, typeName) => {
                var _a;
                const canonicalDirective = (_a = (0, utils_1.getDirective)(schema, inputFieldConfig, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (canonicalDirective != null) {
                    setCanonicalDefinition(typeName, fieldName);
                }
                return undefined;
            },
            [utils_1.MapperKind.UNION_TYPE]: type => {
                var _a;
                const canonicalDirective = (_a = (0, utils_1.getDirective)(schema, type, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (canonicalDirective != null) {
                    setCanonicalDefinition(type.name);
                }
                return undefined;
            },
            [utils_1.MapperKind.ENUM_TYPE]: type => {
                var _a;
                const canonicalDirective = (_a = (0, utils_1.getDirective)(schema, type, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (canonicalDirective != null) {
                    setCanonicalDefinition(type.name);
                }
                return undefined;
            },
            [utils_1.MapperKind.SCALAR_TYPE]: type => {
                var _a;
                const canonicalDirective = (_a = (0, utils_1.getDirective)(schema, type, canonicalDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
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
                    const selectionSet = (0, utils_1.parseSelectionSet)(mergedTypeConfig.selectionSet, { noLocation: true });
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
                        const selectionSet = (0, utils_1.parseSelectionSet)(fieldConfig.selectionSet, { noLocation: true });
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
        (0, utils_1.mapSchema)(schema, {
            [utils_1.MapperKind.OBJECT_FIELD]: function objectFieldMapper(fieldConfig, fieldName) {
                var _a, _b;
                const mergeDirective = (_a = (0, utils_1.getDirective)(schema, fieldConfig, mergeDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (mergeDirective != null) {
                    const returnType = (0, graphql_1.getNullableType)(fieldConfig.type);
                    const returnsList = (0, graphql_1.isListType)(returnType);
                    const namedType = (0, graphql_1.getNamedType)(returnType);
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
                        const parsedMergeArgsExpr = (0, parseMergeArgsExpr_js_1.parseMergeArgsExpr)(mergeArgsExpr, allSelectionSetsByType[typeName] == null
                            ? undefined
                            : mergeSelectionSets(...allSelectionSetsByType[typeName]));
                        const additionalArgs = mergeDirective['additionalArgs'];
                        if (additionalArgs != null) {
                            parsedMergeArgsExpr.args = (0, utils_1.mergeDeep)([
                                parsedMergeArgsExpr.args,
                                (0, graphql_1.valueFromASTUntyped)((0, graphql_1.parseValue)(`{ ${additionalArgs} }`, { noLocation: true })),
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
            mergeTypeConfig.selectionSet = (0, graphql_1.print)(selectionSet);
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
                fieldConfig.selectionSet = (0, graphql_1.print)(selectionSet);
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
exports.stitchingDirectivesTransformer = stitchingDirectivesTransformer;
function forEachConcreteType(schema, type, typeNames, fn) {
    if ((0, graphql_1.isInterfaceType)(type)) {
        for (const typeName of (0, utils_1.getImplementingTypes)(type.name, schema)) {
            if (typeNames == null || typeNames.includes(typeName)) {
                fn(typeName);
            }
        }
    }
    else if ((0, graphql_1.isUnionType)(type)) {
        for (const { name: typeName } of type.getTypes()) {
            if (typeNames == null || typeNames.includes(typeName)) {
                fn(typeName);
            }
        }
    }
    else if ((0, graphql_1.isObjectType)(type)) {
        fn(type.name);
    }
}
function generateKeyFn(mergedTypeResolverInfo) {
    return function keyFn(originalResult) {
        return (0, properties_js_1.getProperties)(originalResult, mergedTypeResolverInfo.usedProperties);
    };
}
function generateArgsFromKeysFn(mergedTypeResolverInfo) {
    const { expansions, args } = mergedTypeResolverInfo;
    return function generateArgsFromKeys(keys) {
        const newArgs = (0, utils_1.mergeDeep)([{}, args]);
        if (expansions) {
            for (const expansion of expansions) {
                const mappingInstructions = expansion.mappingInstructions;
                const expanded = [];
                for (const key of keys) {
                    let newValue = (0, utils_1.mergeDeep)([{}, expansion.valuePath]);
                    for (const { destinationPath, sourcePath } of mappingInstructions) {
                        if (destinationPath.length) {
                            (0, properties_js_1.addProperty)(newValue, destinationPath, (0, properties_js_1.getProperty)(key, sourcePath));
                        }
                        else {
                            newValue = (0, properties_js_1.getProperty)(key, sourcePath);
                        }
                    }
                    expanded.push(newValue);
                }
                (0, properties_js_1.addProperty)(newArgs, expansion.valuePath, expanded);
            }
        }
        return newArgs;
    };
}
function generateArgsFn(mergedTypeResolverInfo) {
    const { mappingInstructions, args, usedProperties } = mergedTypeResolverInfo;
    return function generateArgs(originalResult) {
        const newArgs = (0, utils_1.mergeDeep)([{}, args]);
        const filteredResult = (0, properties_js_1.getProperties)(originalResult, usedProperties);
        if (mappingInstructions) {
            for (const mappingInstruction of mappingInstructions) {
                const { destinationPath, sourcePath } = mappingInstruction;
                (0, properties_js_1.addProperty)(newArgs, destinationPath, (0, properties_js_1.getProperty)(filteredResult, sourcePath));
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
        mergedObject = (0, utils_1.mergeDeep)([mergedObject, object]);
    }
    return JSON.stringify(mergedObject).replace(/"/g, '');
}
function mergeSelectionSets(...selectionSets) {
    const normalizedSelections = Object.create(null);
    for (const selectionSet of selectionSets) {
        for (const selection of selectionSet.selections) {
            const normalizedSelection = (0, graphql_1.print)(selection);
            normalizedSelections[normalizedSelection] = selection;
        }
    }
    const newSelectionSet = {
        kind: graphql_1.Kind.SELECTION_SET,
        selections: Object.values(normalizedSelections),
    };
    return newSelectionSet;
}
function forEachConcreteTypeName(returnType, schema, typeNames, fn) {
    if ((0, graphql_1.isInterfaceType)(returnType)) {
        for (const typeName of (0, utils_1.getImplementingTypes)(returnType.name, schema)) {
            if (typeNames == null || typeNames.includes(typeName)) {
                fn(typeName);
            }
        }
    }
    else if ((0, graphql_1.isUnionType)(returnType)) {
        for (const type of returnType.getTypes()) {
            if (typeNames == null || typeNames.includes(type.name)) {
                fn(type.name);
            }
        }
    }
    else if ((0, graphql_1.isObjectType)(returnType) && (typeNames == null || typeNames.includes(returnType.name))) {
        fn(returnType.name);
    }
}
