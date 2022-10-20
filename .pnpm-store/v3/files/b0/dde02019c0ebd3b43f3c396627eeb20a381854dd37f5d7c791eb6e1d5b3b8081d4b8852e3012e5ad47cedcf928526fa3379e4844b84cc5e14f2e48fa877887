"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInputEnumConsistency = exports.validateTypeConsistency = exports.validateInputFieldConsistency = exports.validateInputObjectConsistency = exports.validateFieldConsistency = void 0;
const graphql_1 = require("graphql");
const types_js_1 = require("./types.js");
function validateFieldConsistency(finalFieldConfig, candidates, typeMergingOptions) {
    const fieldNamespace = `${candidates[0].type.name}.${candidates[0].fieldName}`;
    const finalFieldNull = (0, graphql_1.isNonNullType)(finalFieldConfig.type);
    validateTypeConsistency(finalFieldConfig, candidates.map(c => c.fieldConfig), 'field', fieldNamespace, typeMergingOptions);
    if (getValidationSettings(fieldNamespace, typeMergingOptions).strictNullComparison &&
        candidates.some(c => finalFieldNull !== (0, graphql_1.isNonNullType)(c.fieldConfig.type))) {
        validationMessage(`Nullability of field "${fieldNamespace}" does not match across subschemas. Disable typeMergingOptions.validationSettings.strictNullComparison to permit safe divergences.`, fieldNamespace, typeMergingOptions);
    }
    else if (finalFieldNull && candidates.some(c => !(0, graphql_1.isNonNullType)(c.fieldConfig.type))) {
        validationMessage(`Canonical definition of field "${fieldNamespace}" is not-null while some subschemas permit null. This will be an automatic error in future versions.`, fieldNamespace, typeMergingOptions);
    }
    const argCandidatesMap = Object.create(null);
    for (const { fieldConfig } of candidates) {
        if (fieldConfig.args == null) {
            continue;
        }
        for (const argName in fieldConfig.args) {
            const arg = fieldConfig.args[argName];
            argCandidatesMap[argName] = argCandidatesMap[argName] || [];
            argCandidatesMap[argName].push(arg);
        }
    }
    if (Object.values(argCandidatesMap).some(argCandidates => candidates.length !== argCandidates.length)) {
        validationMessage(`Canonical definition of field "${fieldNamespace}" implements inconsistent argument names across subschemas. Input may be filtered from some requests.`, fieldNamespace, typeMergingOptions);
    }
    for (const argName in argCandidatesMap) {
        if (finalFieldConfig.args == null) {
            continue;
        }
        const argCandidates = argCandidatesMap[argName];
        const argNamespace = `${fieldNamespace}.${argName}`;
        const finalArgConfig = finalFieldConfig.args[argName] || argCandidates[argCandidates.length - 1];
        const finalArgType = (0, graphql_1.getNamedType)(finalArgConfig.type);
        const finalArgNull = (0, graphql_1.isNonNullType)(finalArgConfig.type);
        validateTypeConsistency(finalArgConfig, argCandidates, 'argument', argNamespace, typeMergingOptions);
        if (getValidationSettings(argNamespace, typeMergingOptions).strictNullComparison &&
            argCandidates.some(c => finalArgNull !== (0, graphql_1.isNonNullType)(c.type))) {
            validationMessage(`Nullability of argument "${argNamespace}" does not match across subschemas. Disable typeMergingOptions.validationSettings.strictNullComparison to permit safe divergences.`, argNamespace, typeMergingOptions);
        }
        else if (!finalArgNull && argCandidates.some(c => (0, graphql_1.isNonNullType)(c.type))) {
            validationMessage(`Canonical definition of argument "${argNamespace}" permits null while some subschemas require not-null. This will be an automatic error in future versions.`, argNamespace, typeMergingOptions);
        }
        if ((0, graphql_1.isEnumType)(finalArgType)) {
            validateInputEnumConsistency(finalArgType, argCandidates, typeMergingOptions);
        }
    }
}
exports.validateFieldConsistency = validateFieldConsistency;
function validateInputObjectConsistency(fieldInclusionMap, candidates, typeMergingOptions) {
    for (const fieldName in fieldInclusionMap) {
        const count = fieldInclusionMap[fieldName];
        if (candidates.length !== count) {
            const namespace = `${candidates[0].type.name}.${fieldName}`;
            validationMessage(`Definition of input field "${namespace}" is not implemented by all subschemas. Input may be filtered from some requests.`, namespace, typeMergingOptions);
        }
    }
}
exports.validateInputObjectConsistency = validateInputObjectConsistency;
function validateInputFieldConsistency(finalInputFieldConfig, candidates, typeMergingOptions) {
    const inputFieldNamespace = `${candidates[0].type.name}.${candidates[0].fieldName}`;
    const inputFieldConfigs = candidates.map(c => c.inputFieldConfig);
    const finalInputFieldType = (0, graphql_1.getNamedType)(finalInputFieldConfig.type);
    const finalInputFieldNull = (0, graphql_1.isNonNullType)(finalInputFieldConfig.type);
    validateTypeConsistency(finalInputFieldConfig, inputFieldConfigs, 'input field', inputFieldNamespace, typeMergingOptions);
    if (getValidationSettings(inputFieldNamespace, typeMergingOptions).strictNullComparison &&
        candidates.some(c => finalInputFieldNull !== (0, graphql_1.isNonNullType)(c.inputFieldConfig.type))) {
        validationMessage(`Nullability of input field "${inputFieldNamespace}" does not match across subschemas. Disable typeMergingOptions.validationSettings.strictNullComparison to permit safe divergences.`, inputFieldNamespace, typeMergingOptions);
    }
    else if (!finalInputFieldNull && candidates.some(c => (0, graphql_1.isNonNullType)(c.inputFieldConfig.type))) {
        validationMessage(`Canonical definition of input field "${inputFieldNamespace}" permits null while some subschemas require not-null. This will be an automatic error in future versions.`, inputFieldNamespace, typeMergingOptions);
    }
    if ((0, graphql_1.isEnumType)(finalInputFieldType)) {
        validateInputEnumConsistency(finalInputFieldType, inputFieldConfigs, typeMergingOptions);
    }
}
exports.validateInputFieldConsistency = validateInputFieldConsistency;
function validateTypeConsistency(finalElementConfig, candidates, definitionType, settingNamespace, typeMergingOptions) {
    var _a, _b, _c;
    const finalNamedType = (0, graphql_1.getNamedType)(finalElementConfig.type);
    const finalIsScalar = (0, graphql_1.isScalarType)(finalNamedType);
    const finalIsList = hasListType(finalElementConfig.type);
    for (const c of candidates) {
        if (finalIsList !== hasListType(c.type)) {
            throw new Error(`Definitions of ${definitionType} "${settingNamespace}" implement inconsistent list types across subschemas and cannot be merged.`);
        }
        const currentNamedType = (0, graphql_1.getNamedType)(c.type);
        if (finalNamedType.toString() !== currentNamedType.toString()) {
            const proxiableScalar = !!((_c = (_b = (_a = typeMergingOptions === null || typeMergingOptions === void 0 ? void 0 : typeMergingOptions.validationSettings) === null || _a === void 0 ? void 0 : _a.proxiableScalars) === null || _b === void 0 ? void 0 : _b[finalNamedType.toString()]) === null || _c === void 0 ? void 0 : _c.includes(currentNamedType.toString()));
            const bothScalars = finalIsScalar && (0, graphql_1.isScalarType)(currentNamedType);
            const permitScalar = proxiableScalar && bothScalars;
            if (proxiableScalar && !bothScalars) {
                throw new Error(`Types ${finalNamedType} and ${currentNamedType} are not proxiable scalars.`);
            }
            if (!permitScalar) {
                validationMessage(`Definitions of ${definitionType} "${settingNamespace}" implement inconsistent named types across subschemas. This will be an automatic error in future versions.`, settingNamespace, typeMergingOptions);
            }
        }
    }
}
exports.validateTypeConsistency = validateTypeConsistency;
function hasListType(type) {
    return (0, graphql_1.isListType)((0, graphql_1.getNullableType)(type));
}
function validateInputEnumConsistency(inputEnumType, candidates, typeMergingOptions) {
    const enumValueInclusionMap = Object.create(null);
    for (const candidate of candidates) {
        const enumType = (0, graphql_1.getNamedType)(candidate.type);
        if ((0, graphql_1.isEnumType)(enumType)) {
            for (const { value } of enumType.getValues()) {
                enumValueInclusionMap[value] = enumValueInclusionMap[value] || 0;
                enumValueInclusionMap[value] += 1;
            }
        }
    }
    if (Object.values(enumValueInclusionMap).some(count => candidates.length !== count)) {
        validationMessage(`Enum "${inputEnumType.name}" is used as an input with inconsistent values across subschemas. This will be an automatic error in future versions.`, inputEnumType.name, typeMergingOptions);
    }
}
exports.validateInputEnumConsistency = validateInputEnumConsistency;
function validationMessage(message, settingNamespace, typeMergingOptions) {
    var _a;
    const override = `typeMergingOptions.validationScopes['${settingNamespace}'].validationLevel`;
    const settings = getValidationSettings(settingNamespace, typeMergingOptions);
    switch ((_a = settings.validationLevel) !== null && _a !== void 0 ? _a : types_js_1.ValidationLevel.Warn) {
        case types_js_1.ValidationLevel.Off:
            return;
        case types_js_1.ValidationLevel.Error:
            throw new Error(`${message} If this is intentional, you may disable this error by setting ${override} = "warn|off"`);
        default:
            console.warn(`${message} To disable this warning or elevate it to an error, set ${override} = "error|off"`);
    }
}
function getValidationSettings(settingNamespace, typeMergingOptions) {
    var _a, _b, _c;
    return {
        ...((_a = typeMergingOptions === null || typeMergingOptions === void 0 ? void 0 : typeMergingOptions.validationSettings) !== null && _a !== void 0 ? _a : {}),
        ...((_c = (_b = typeMergingOptions === null || typeMergingOptions === void 0 ? void 0 : typeMergingOptions.validationScopes) === null || _b === void 0 ? void 0 : _b[settingNamespace]) !== null && _c !== void 0 ? _c : {}),
    };
}
