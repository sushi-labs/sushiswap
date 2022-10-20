"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeCandidates = void 0;
const graphql_1 = require("graphql");
const merge_1 = require("@graphql-tools/merge");
const mergeValidations_js_1 = require("./mergeValidations.js");
const delegate_1 = require("@graphql-tools/delegate");
function mergeCandidates(typeName, candidates, typeMergingOptions) {
    const initialCandidateType = candidates[0].type;
    if (candidates.some(candidate => candidate.type.constructor !== initialCandidateType.constructor)) {
        throw new Error(`Cannot merge different type categories into common type ${typeName}.`);
    }
    if ((0, graphql_1.isObjectType)(initialCandidateType)) {
        return mergeObjectTypeCandidates(typeName, candidates, typeMergingOptions);
    }
    else if ((0, graphql_1.isInputObjectType)(initialCandidateType)) {
        return mergeInputObjectTypeCandidates(typeName, candidates, typeMergingOptions);
    }
    else if ((0, graphql_1.isInterfaceType)(initialCandidateType)) {
        return mergeInterfaceTypeCandidates(typeName, candidates, typeMergingOptions);
    }
    else if ((0, graphql_1.isUnionType)(initialCandidateType)) {
        return mergeUnionTypeCandidates(typeName, candidates, typeMergingOptions);
    }
    else if ((0, graphql_1.isEnumType)(initialCandidateType)) {
        return mergeEnumTypeCandidates(typeName, candidates, typeMergingOptions);
    }
    else if ((0, graphql_1.isScalarType)(initialCandidateType)) {
        return mergeScalarTypeCandidates(typeName, candidates, typeMergingOptions);
    }
    else {
        // not reachable.
        throw new Error(`Type ${typeName} has unknown GraphQL type.`);
    }
}
exports.mergeCandidates = mergeCandidates;
function mergeObjectTypeCandidates(typeName, candidates, typeMergingOptions) {
    candidates = orderedTypeCandidates(candidates, typeMergingOptions);
    const description = mergeTypeDescriptions(candidates, typeMergingOptions);
    const fields = fieldConfigMapFromTypeCandidates(candidates, typeMergingOptions);
    const typeConfigs = candidates.map(candidate => candidate.type.toConfig());
    const interfaceMap = typeConfigs
        .map(typeConfig => typeConfig.interfaces)
        .reduce((acc, interfaces) => {
        if (interfaces != null) {
            for (const iface of interfaces) {
                acc[iface.name] = iface;
            }
        }
        return acc;
    }, Object.create(null));
    const interfaces = Object.values(interfaceMap);
    const astNodes = pluck('astNode', candidates);
    const fieldAstNodes = canonicalFieldNamesForType(candidates)
        .map(fieldName => { var _a; return (_a = fields[fieldName]) === null || _a === void 0 ? void 0 : _a.astNode; })
        .filter(n => n != null);
    if (astNodes.length > 1 && fieldAstNodes.length) {
        astNodes.push({
            ...astNodes[astNodes.length - 1],
            fields: JSON.parse(JSON.stringify(fieldAstNodes)),
        });
    }
    const astNode = astNodes
        .slice(1)
        .reduce((acc, astNode) => (0, merge_1.mergeType)(astNode, acc, { ignoreFieldConflicts: true }), astNodes[0]);
    const extensionASTNodes = pluck('extensionASTNodes', candidates);
    const extensions = Object.assign({}, ...pluck('extensions', candidates));
    const typeConfig = {
        name: typeName,
        description,
        fields,
        interfaces,
        astNode,
        extensionASTNodes,
        extensions,
    };
    return new graphql_1.GraphQLObjectType(typeConfig);
}
function mergeInputObjectTypeCandidates(typeName, candidates, typeMergingOptions) {
    candidates = orderedTypeCandidates(candidates, typeMergingOptions);
    const description = mergeTypeDescriptions(candidates, typeMergingOptions);
    const fields = inputFieldConfigMapFromTypeCandidates(candidates, typeMergingOptions);
    const astNodes = pluck('astNode', candidates);
    const fieldAstNodes = canonicalFieldNamesForType(candidates)
        .map(fieldName => { var _a; return (_a = fields[fieldName]) === null || _a === void 0 ? void 0 : _a.astNode; })
        .filter(n => n != null);
    if (astNodes.length > 1 && fieldAstNodes.length) {
        astNodes.push({
            ...astNodes[astNodes.length - 1],
            fields: JSON.parse(JSON.stringify(fieldAstNodes)),
        });
    }
    const astNode = astNodes.slice(1).reduce((acc, astNode) => (0, merge_1.mergeInputType)(astNode, acc, {
        ignoreFieldConflicts: true,
    }), astNodes[0]);
    const extensionASTNodes = pluck('extensionASTNodes', candidates);
    const extensions = Object.assign({}, ...pluck('extensions', candidates));
    const typeConfig = {
        name: typeName,
        description,
        fields,
        astNode,
        extensionASTNodes,
        extensions,
    };
    return new graphql_1.GraphQLInputObjectType(typeConfig);
}
function pluck(typeProperty, candidates) {
    return candidates.map(candidate => candidate.type[typeProperty]).filter(value => value != null);
}
function mergeInterfaceTypeCandidates(typeName, candidates, typeMergingOptions) {
    candidates = orderedTypeCandidates(candidates, typeMergingOptions);
    const description = mergeTypeDescriptions(candidates, typeMergingOptions);
    const fields = fieldConfigMapFromTypeCandidates(candidates, typeMergingOptions);
    const typeConfigs = candidates.map(candidate => candidate.type.toConfig());
    const interfaceMap = typeConfigs
        .map(typeConfig => ('interfaces' in typeConfig ? typeConfig.interfaces : []))
        .reduce((acc, interfaces) => {
        if (interfaces != null) {
            for (const iface of interfaces) {
                acc[iface.name] = iface;
            }
        }
        return acc;
    }, Object.create(null));
    const interfaces = Object.values(interfaceMap);
    const astNodes = pluck('astNode', candidates);
    const fieldAstNodes = canonicalFieldNamesForType(candidates)
        .map(fieldName => { var _a; return (_a = fields[fieldName]) === null || _a === void 0 ? void 0 : _a.astNode; })
        .filter(n => n != null);
    if (astNodes.length > 1 && fieldAstNodes.length) {
        astNodes.push({
            ...astNodes[astNodes.length - 1],
            fields: JSON.parse(JSON.stringify(fieldAstNodes)),
        });
    }
    const astNode = astNodes.slice(1).reduce((acc, astNode) => (0, merge_1.mergeInterface)(astNode, acc, {
        ignoreFieldConflicts: true,
    }), astNodes[0]);
    const extensionASTNodes = pluck('extensionASTNodes', candidates);
    const extensions = Object.assign({}, ...pluck('extensions', candidates));
    const typeConfig = {
        name: typeName,
        description,
        fields,
        interfaces,
        astNode,
        extensionASTNodes,
        extensions,
    };
    return new graphql_1.GraphQLInterfaceType(typeConfig);
}
function mergeUnionTypeCandidates(typeName, candidates, typeMergingOptions) {
    candidates = orderedTypeCandidates(candidates, typeMergingOptions);
    const description = mergeTypeDescriptions(candidates, typeMergingOptions);
    const typeConfigs = candidates.map(candidate => {
        if (!(0, graphql_1.isUnionType)(candidate.type)) {
            throw new Error(`Expected ${candidate.type} to be a union type!`);
        }
        return candidate.type.toConfig();
    });
    const typeMap = typeConfigs.reduce((acc, typeConfig) => {
        for (const type of typeConfig.types) {
            acc[type.name] = type;
        }
        return acc;
    }, Object.create(null));
    const types = Object.values(typeMap);
    const astNodes = pluck('astNode', candidates);
    const astNode = astNodes
        .slice(1)
        .reduce((acc, astNode) => (0, merge_1.mergeUnion)(astNode, acc), astNodes[0]);
    const extensionASTNodes = pluck('extensionASTNodes', candidates);
    const extensions = Object.assign({}, ...pluck('extensions', candidates));
    const typeConfig = {
        name: typeName,
        description,
        types,
        astNode,
        extensionASTNodes,
        extensions,
    };
    return new graphql_1.GraphQLUnionType(typeConfig);
}
function mergeEnumTypeCandidates(typeName, candidates, typeMergingOptions) {
    candidates = orderedTypeCandidates(candidates, typeMergingOptions);
    const description = mergeTypeDescriptions(candidates, typeMergingOptions);
    const values = enumValueConfigMapFromTypeCandidates(candidates, typeMergingOptions);
    const astNodes = pluck('astNode', candidates);
    const astNode = astNodes
        .slice(1)
        .reduce((acc, astNode) => (0, merge_1.mergeEnum)(astNode, acc, { consistentEnumMerge: true }), astNodes[0]);
    const extensionASTNodes = pluck('extensionASTNodes', candidates);
    const extensions = Object.assign({}, ...pluck('extensions', candidates));
    const typeConfig = {
        name: typeName,
        description,
        values,
        astNode,
        extensionASTNodes,
        extensions,
    };
    return new graphql_1.GraphQLEnumType(typeConfig);
}
function enumValueConfigMapFromTypeCandidates(candidates, typeMergingOptions) {
    var _a;
    const enumValueConfigCandidatesMap = Object.create(null);
    for (const candidate of candidates) {
        const valueMap = candidate.type.toConfig().values;
        for (const enumValue in valueMap) {
            const enumValueConfigCandidate = {
                enumValueConfig: valueMap[enumValue],
                enumValue,
                type: candidate.type,
                subschema: candidate.subschema,
                transformedSubschema: candidate.transformedSubschema,
            };
            if (enumValue in enumValueConfigCandidatesMap) {
                enumValueConfigCandidatesMap[enumValue].push(enumValueConfigCandidate);
            }
            else {
                enumValueConfigCandidatesMap[enumValue] = [enumValueConfigCandidate];
            }
        }
    }
    const enumValueConfigMap = Object.create(null);
    for (const enumValue in enumValueConfigCandidatesMap) {
        const enumValueConfigMerger = (_a = typeMergingOptions === null || typeMergingOptions === void 0 ? void 0 : typeMergingOptions.enumValueConfigMerger) !== null && _a !== void 0 ? _a : defaultEnumValueConfigMerger;
        enumValueConfigMap[enumValue] = enumValueConfigMerger(enumValueConfigCandidatesMap[enumValue]);
    }
    return enumValueConfigMap;
}
function defaultEnumValueConfigMerger(candidates) {
    const preferred = candidates.find(({ type, transformedSubschema }) => { var _a, _b; return (0, delegate_1.isSubschemaConfig)(transformedSubschema) && ((_b = (_a = transformedSubschema.merge) === null || _a === void 0 ? void 0 : _a[type.name]) === null || _b === void 0 ? void 0 : _b.canonical); });
    return (preferred || candidates[candidates.length - 1]).enumValueConfig;
}
function mergeScalarTypeCandidates(typeName, candidates, typeMergingOptions) {
    candidates = orderedTypeCandidates(candidates, typeMergingOptions);
    const description = mergeTypeDescriptions(candidates, typeMergingOptions);
    const serializeFns = pluck('serialize', candidates);
    const serialize = serializeFns[serializeFns.length - 1];
    const parseValueFns = pluck('parseValue', candidates);
    const parseValue = parseValueFns[parseValueFns.length - 1];
    const parseLiteralFns = pluck('parseLiteral', candidates);
    const parseLiteral = parseLiteralFns[parseLiteralFns.length - 1];
    const astNodes = pluck('astNode', candidates);
    const astNode = astNodes
        .slice(1)
        .reduce((acc, astNode) => (0, merge_1.mergeScalar)(astNode, acc), astNodes[0]);
    const extensionASTNodes = pluck('extensionASTNodes', candidates);
    const extensions = Object.assign({}, ...pluck('extensions', candidates));
    const typeConfig = {
        name: typeName,
        description,
        serialize,
        parseValue,
        parseLiteral,
        astNode,
        extensionASTNodes,
        extensions,
    };
    return new graphql_1.GraphQLScalarType(typeConfig);
}
function orderedTypeCandidates(candidates, typeMergingOptions) {
    var _a;
    const typeCandidateMerger = (_a = typeMergingOptions === null || typeMergingOptions === void 0 ? void 0 : typeMergingOptions.typeCandidateMerger) !== null && _a !== void 0 ? _a : defaultTypeCandidateMerger;
    const candidate = typeCandidateMerger(candidates);
    return candidates.filter(c => c !== candidate).concat([candidate]);
}
function defaultTypeCandidateMerger(candidates) {
    const canonical = candidates.filter(({ type, transformedSubschema }) => { var _a, _b; return (0, delegate_1.isSubschemaConfig)(transformedSubschema) ? (_b = (_a = transformedSubschema.merge) === null || _a === void 0 ? void 0 : _a[type.name]) === null || _b === void 0 ? void 0 : _b.canonical : false; });
    if (canonical.length > 1) {
        throw new Error(`Multiple canonical definitions for "${canonical[0].type.name}"`);
    }
    else if (canonical.length) {
        return canonical[0];
    }
    return candidates[candidates.length - 1];
}
function mergeTypeDescriptions(candidates, typeMergingOptions) {
    var _a;
    const typeDescriptionsMerger = (_a = typeMergingOptions === null || typeMergingOptions === void 0 ? void 0 : typeMergingOptions.typeDescriptionsMerger) !== null && _a !== void 0 ? _a : defaultTypeDescriptionMerger;
    return typeDescriptionsMerger(candidates);
}
function defaultTypeDescriptionMerger(candidates) {
    return candidates[candidates.length - 1].type.description;
}
function fieldConfigMapFromTypeCandidates(candidates, typeMergingOptions) {
    const fieldConfigCandidatesMap = Object.create(null);
    for (const candidate of candidates) {
        const typeConfig = candidate.type.toConfig();
        const fieldConfigMap = typeConfig.fields;
        for (const fieldName in fieldConfigMap) {
            const fieldConfig = fieldConfigMap[fieldName];
            const fieldConfigCandidate = {
                fieldConfig,
                fieldName,
                type: candidate.type,
                subschema: candidate.subschema,
                transformedSubschema: candidate.transformedSubschema,
            };
            if (fieldName in fieldConfigCandidatesMap) {
                fieldConfigCandidatesMap[fieldName].push(fieldConfigCandidate);
            }
            else {
                fieldConfigCandidatesMap[fieldName] = [fieldConfigCandidate];
            }
        }
    }
    const fieldConfigMap = Object.create(null);
    for (const fieldName in fieldConfigCandidatesMap) {
        fieldConfigMap[fieldName] = mergeFieldConfigs(fieldConfigCandidatesMap[fieldName], typeMergingOptions);
    }
    return fieldConfigMap;
}
function mergeFieldConfigs(candidates, typeMergingOptions) {
    var _a;
    const fieldConfigMerger = (_a = typeMergingOptions === null || typeMergingOptions === void 0 ? void 0 : typeMergingOptions.fieldConfigMerger) !== null && _a !== void 0 ? _a : defaultFieldConfigMerger;
    const finalFieldConfig = fieldConfigMerger(candidates);
    (0, mergeValidations_js_1.validateFieldConsistency)(finalFieldConfig, candidates, typeMergingOptions);
    return finalFieldConfig;
}
function defaultFieldConfigMerger(candidates) {
    var _a, _b, _c, _d, _e, _f;
    const canonicalByField = [];
    const canonicalByType = [];
    for (const { type, fieldName, fieldConfig, transformedSubschema } of candidates) {
        if (!(0, delegate_1.isSubschemaConfig)(transformedSubschema))
            continue;
        if ((_d = (_c = (_b = (_a = transformedSubschema.merge) === null || _a === void 0 ? void 0 : _a[type.name]) === null || _b === void 0 ? void 0 : _b.fields) === null || _c === void 0 ? void 0 : _c[fieldName]) === null || _d === void 0 ? void 0 : _d.canonical) {
            canonicalByField.push(fieldConfig);
        }
        else if ((_f = (_e = transformedSubschema.merge) === null || _e === void 0 ? void 0 : _e[type.name]) === null || _f === void 0 ? void 0 : _f.canonical) {
            canonicalByType.push(fieldConfig);
        }
    }
    if (canonicalByField.length > 1) {
        throw new Error(`Multiple canonical definitions for "${candidates[0].type.name}.${candidates[0].fieldName}"`);
    }
    else if (canonicalByField.length) {
        return canonicalByField[0];
    }
    else if (canonicalByType.length) {
        return canonicalByType[0];
    }
    return candidates[candidates.length - 1].fieldConfig;
}
function inputFieldConfigMapFromTypeCandidates(candidates, typeMergingOptions) {
    var _a;
    const inputFieldConfigCandidatesMap = Object.create(null);
    const fieldInclusionMap = Object.create(null);
    for (const candidate of candidates) {
        const typeConfig = candidate.type.toConfig();
        const inputFieldConfigMap = typeConfig.fields;
        for (const fieldName in inputFieldConfigMap) {
            const inputFieldConfig = inputFieldConfigMap[fieldName];
            fieldInclusionMap[fieldName] = fieldInclusionMap[fieldName] || 0;
            fieldInclusionMap[fieldName] += 1;
            const inputFieldConfigCandidate = {
                inputFieldConfig,
                fieldName,
                type: candidate.type,
                subschema: candidate.subschema,
                transformedSubschema: candidate.transformedSubschema,
            };
            if (fieldName in inputFieldConfigCandidatesMap) {
                inputFieldConfigCandidatesMap[fieldName].push(inputFieldConfigCandidate);
            }
            else {
                inputFieldConfigCandidatesMap[fieldName] = [inputFieldConfigCandidate];
            }
        }
    }
    (0, mergeValidations_js_1.validateInputObjectConsistency)(fieldInclusionMap, candidates, typeMergingOptions);
    const inputFieldConfigMap = Object.create(null);
    for (const fieldName in inputFieldConfigCandidatesMap) {
        const inputFieldConfigMerger = (_a = typeMergingOptions === null || typeMergingOptions === void 0 ? void 0 : typeMergingOptions.inputFieldConfigMerger) !== null && _a !== void 0 ? _a : defaultInputFieldConfigMerger;
        inputFieldConfigMap[fieldName] = inputFieldConfigMerger(inputFieldConfigCandidatesMap[fieldName]);
        (0, mergeValidations_js_1.validateInputFieldConsistency)(inputFieldConfigMap[fieldName], inputFieldConfigCandidatesMap[fieldName], typeMergingOptions);
    }
    return inputFieldConfigMap;
}
function defaultInputFieldConfigMerger(candidates) {
    var _a, _b, _c, _d, _e, _f;
    const canonicalByField = [];
    const canonicalByType = [];
    for (const { type, fieldName, inputFieldConfig, transformedSubschema } of candidates) {
        if (!(0, delegate_1.isSubschemaConfig)(transformedSubschema))
            continue;
        if ((_d = (_c = (_b = (_a = transformedSubschema.merge) === null || _a === void 0 ? void 0 : _a[type.name]) === null || _b === void 0 ? void 0 : _b.fields) === null || _c === void 0 ? void 0 : _c[fieldName]) === null || _d === void 0 ? void 0 : _d.canonical) {
            canonicalByField.push(inputFieldConfig);
        }
        else if ((_f = (_e = transformedSubschema.merge) === null || _e === void 0 ? void 0 : _e[type.name]) === null || _f === void 0 ? void 0 : _f.canonical) {
            canonicalByType.push(inputFieldConfig);
        }
    }
    if (canonicalByField.length > 1) {
        throw new Error(`Multiple canonical definitions for "${candidates[0].type.name}.${candidates[0].fieldName}"`);
    }
    else if (canonicalByField.length) {
        return canonicalByField[0];
    }
    else if (canonicalByType.length) {
        return canonicalByType[0];
    }
    return candidates[candidates.length - 1].inputFieldConfig;
}
function canonicalFieldNamesForType(candidates) {
    var _a;
    const canonicalFieldNames = Object.create(null);
    for (const { type, transformedSubschema } of candidates) {
        if (!(0, delegate_1.isSubschemaConfig)(transformedSubschema))
            continue;
        const mergeConfig = (_a = transformedSubschema.merge) === null || _a === void 0 ? void 0 : _a[type.name];
        if (mergeConfig != null && mergeConfig.fields != null && !mergeConfig.canonical) {
            for (const fieldName in mergeConfig.fields) {
                const mergedFieldConfig = mergeConfig.fields[fieldName];
                if (mergedFieldConfig.canonical) {
                    canonicalFieldNames[fieldName] = true;
                }
            }
        }
    }
    return Object.keys(canonicalFieldNames);
}
