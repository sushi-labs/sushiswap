import { isObjectType, isInterfaceType } from 'graphql';
import { getImplementingTypes, pruneSchema, filterSchema } from '@graphql-tools/utils';
import { TransformCompositeFields } from '@graphql-tools/wrap';
export function isolateComputedFieldsTransformer(subschemaConfig) {
    if (subschemaConfig.merge == null) {
        return [subschemaConfig];
    }
    const baseSchemaTypes = Object.create(null);
    const isolatedSchemaTypes = Object.create(null);
    for (const typeName in subschemaConfig.merge) {
        const mergedTypeConfig = subschemaConfig.merge[typeName];
        baseSchemaTypes[typeName] = mergedTypeConfig;
        if (mergedTypeConfig.fields) {
            const baseFields = Object.create(null);
            const isolatedFields = Object.create(null);
            for (const fieldName in mergedTypeConfig.fields) {
                const mergedFieldConfig = mergedTypeConfig.fields[fieldName];
                if (mergedFieldConfig.computed && mergedFieldConfig.selectionSet) {
                    isolatedFields[fieldName] = mergedFieldConfig;
                }
                else if (mergedFieldConfig.computed) {
                    throw new Error(`A selectionSet is required for computed field "${typeName}.${fieldName}"`);
                }
                else {
                    baseFields[fieldName] = mergedFieldConfig;
                }
            }
            const isolatedFieldCount = Object.keys(isolatedFields).length;
            const objectType = subschemaConfig.schema.getType(typeName);
            if (isolatedFieldCount && isolatedFieldCount !== Object.keys(objectType.getFields()).length) {
                baseSchemaTypes[typeName] = {
                    ...mergedTypeConfig,
                    fields: baseFields,
                };
                isolatedSchemaTypes[typeName] = {
                    ...mergedTypeConfig,
                    fields: isolatedFields,
                    canonical: undefined,
                };
            }
        }
    }
    if (Object.keys(isolatedSchemaTypes).length) {
        return [
            filterBaseSubschema({ ...subschemaConfig, merge: baseSchemaTypes }, isolatedSchemaTypes),
            filterIsolatedSubschema({ ...subschemaConfig, merge: isolatedSchemaTypes }),
        ];
    }
    return [subschemaConfig];
}
function filterBaseSubschema(subschemaConfig, isolatedSchemaTypes) {
    var _a;
    const schema = subschemaConfig.schema;
    const typesForInterface = {};
    const filteredSchema = pruneSchema(filterSchema({
        schema,
        objectFieldFilter: (typeName, fieldName) => { var _a, _b; return !((_b = (_a = isolatedSchemaTypes[typeName]) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b[fieldName]); },
        interfaceFieldFilter: (typeName, fieldName) => {
            if (!typesForInterface[typeName]) {
                typesForInterface[typeName] = getImplementingTypes(typeName, schema);
            }
            return !typesForInterface[typeName].some(implementingTypeName => { var _a, _b; return (_b = (_a = isolatedSchemaTypes[implementingTypeName]) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b[fieldName]; });
        },
    }));
    const filteredFields = {};
    for (const typeName in filteredSchema.getTypeMap()) {
        const type = filteredSchema.getType(typeName);
        if (isObjectType(type) || isInterfaceType(type)) {
            filteredFields[typeName] = { __typename: true };
            const fieldMap = type.getFields();
            for (const fieldName in fieldMap) {
                filteredFields[typeName][fieldName] = true;
            }
        }
    }
    const filteredSubschema = {
        ...subschemaConfig,
        merge: subschemaConfig.merge
            ? {
                ...subschemaConfig.merge,
            }
            : undefined,
        transforms: ((_a = subschemaConfig.transforms) !== null && _a !== void 0 ? _a : []).concat([
            new TransformCompositeFields((typeName, fieldName) => { var _a; return (((_a = filteredFields[typeName]) === null || _a === void 0 ? void 0 : _a[fieldName]) ? undefined : null); }, (typeName, fieldName) => { var _a; return (((_a = filteredFields[typeName]) === null || _a === void 0 ? void 0 : _a[fieldName]) ? undefined : null); }),
        ]),
    };
    const remainingTypes = filteredSchema.getTypeMap();
    const mergeConfig = filteredSubschema.merge;
    if (mergeConfig) {
        for (const mergeType in mergeConfig) {
            if (!remainingTypes[mergeType]) {
                delete mergeConfig[mergeType];
            }
        }
        if (!Object.keys(mergeConfig).length) {
            delete filteredSubschema.merge;
        }
    }
    return filteredSubschema;
}
function filterIsolatedSubschema(subschemaConfig) {
    var _a, _b, _c;
    const rootFields = {};
    for (const typeName in subschemaConfig.merge) {
        const mergedTypeConfig = subschemaConfig.merge[typeName];
        const entryPoints = (_a = mergedTypeConfig.entryPoints) !== null && _a !== void 0 ? _a : [mergedTypeConfig];
        for (const entryPoint of entryPoints) {
            if (entryPoint.fieldName != null) {
                rootFields[entryPoint.fieldName] = true;
            }
        }
    }
    const interfaceFields = {};
    for (const typeName in subschemaConfig.merge) {
        const type = subschemaConfig.schema.getType(typeName);
        if (!type || !('getInterfaces' in type)) {
            throw new Error(`${typeName} expected to have 'getInterfaces' method`);
        }
        for (const int of type.getInterfaces()) {
            const intType = subschemaConfig.schema.getType(int.name);
            if (!intType || !('getFields' in intType)) {
                throw new Error(`${int.name} expected to have 'getFields' method`);
            }
            for (const intFieldName in intType.getFields()) {
                if ((_b = subschemaConfig.merge[typeName].fields) === null || _b === void 0 ? void 0 : _b[intFieldName]) {
                    interfaceFields[int.name] = interfaceFields[int.name] || {};
                    interfaceFields[int.name][intFieldName] = true;
                }
            }
        }
    }
    const filteredSchema = pruneSchema(filterSchema({
        schema: subschemaConfig.schema,
        rootFieldFilter: (operation, fieldName) => operation === 'Query' && rootFields[fieldName] != null,
        objectFieldFilter: (typeName, fieldName) => { var _a, _b; return ((_b = (_a = subschemaConfig.merge[typeName]) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b[fieldName]) != null; },
        interfaceFieldFilter: (typeName, fieldName) => { var _a; return ((_a = interfaceFields[typeName]) === null || _a === void 0 ? void 0 : _a[fieldName]) != null; },
    }));
    const filteredFields = {};
    for (const typeName in filteredSchema.getTypeMap()) {
        const type = filteredSchema.getType(typeName);
        if (isObjectType(type) || isInterfaceType(type)) {
            filteredFields[typeName] = { __typename: true };
            const fieldMap = type.getFields();
            for (const fieldName in fieldMap) {
                filteredFields[typeName][fieldName] = true;
            }
        }
    }
    return {
        ...subschemaConfig,
        transforms: ((_c = subschemaConfig.transforms) !== null && _c !== void 0 ? _c : []).concat([
            new TransformCompositeFields((typeName, fieldName) => { var _a; return (((_a = filteredFields[typeName]) === null || _a === void 0 ? void 0 : _a[fieldName]) ? undefined : null); }, (typeName, fieldName) => { var _a; return (((_a = filteredFields[typeName]) === null || _a === void 0 ? void 0 : _a[fieldName]) ? undefined : null); }),
        ]),
    };
}
