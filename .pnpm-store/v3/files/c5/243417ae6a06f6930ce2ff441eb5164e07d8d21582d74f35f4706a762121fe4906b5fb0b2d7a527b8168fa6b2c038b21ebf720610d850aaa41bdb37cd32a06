import { visit, Kind, TypeInfo, visitWithTypeInfo, valueFromAST, isLeafType, astFromValue, valueFromASTUntyped, } from 'graphql';
import { visitResult, transformInputValue, } from '@graphql-tools/utils';
export default class MapLeafValues {
    constructor(inputValueTransformer, outputValueTransformer) {
        this.inputValueTransformer = inputValueTransformer;
        this.outputValueTransformer = outputValueTransformer;
        this.resultVisitorMap = Object.create(null);
    }
    _getTypeInfo() {
        const typeInfo = this.typeInfo;
        if (typeInfo === undefined) {
            throw new Error(`The MapLeafValues transform's  "transformRequest" and "transformResult" methods cannot be used without first calling "transformSchema".`);
        }
        return typeInfo;
    }
    _getOriginalWrappingSchema() {
        const originalWrappingSchema = this.originalWrappingSchema;
        if (originalWrappingSchema === undefined) {
            throw new Error(`The MapLeafValues transform's  "transformRequest" and "transformResult" methods cannot be used without first calling "transformSchema".`);
        }
        return originalWrappingSchema;
    }
    transformSchema(originalWrappingSchema, _subschemaConfig) {
        this.originalWrappingSchema = originalWrappingSchema;
        const typeMap = originalWrappingSchema.getTypeMap();
        for (const typeName in typeMap) {
            const type = typeMap[typeName];
            if (!typeName.startsWith('__')) {
                if (isLeafType(type)) {
                    this.resultVisitorMap[typeName] = (value) => this.outputValueTransformer(typeName, value);
                }
            }
        }
        this.typeInfo = new TypeInfo(originalWrappingSchema);
        return originalWrappingSchema;
    }
    transformRequest(originalRequest, _delegationContext, transformationContext) {
        var _a;
        const document = originalRequest.document;
        const variableValues = (_a = originalRequest.variables) !== null && _a !== void 0 ? _a : {};
        const operations = document.definitions.filter(def => def.kind === Kind.OPERATION_DEFINITION);
        const fragments = document.definitions.filter(def => def.kind === Kind.FRAGMENT_DEFINITION);
        const newOperations = this.transformOperations(operations, variableValues);
        const transformedRequest = {
            ...originalRequest,
            document: {
                ...document,
                definitions: [...newOperations, ...fragments],
            },
            variables: variableValues,
        };
        transformationContext.transformedRequest = transformedRequest;
        return transformedRequest;
    }
    transformResult(originalResult, _delegationContext, transformationContext) {
        return visitResult(originalResult, transformationContext.transformedRequest, this._getOriginalWrappingSchema(), this.resultVisitorMap);
    }
    transformOperations(operations, variableValues) {
        return operations.map((operation) => {
            return visit(operation, visitWithTypeInfo(this._getTypeInfo(), {
                [Kind.FIELD]: node => this.transformFieldNode(node, variableValues),
            }));
        });
    }
    transformFieldNode(field, variableValues) {
        const targetField = this._getTypeInfo().getFieldDef();
        if (!targetField) {
            return;
        }
        if (!targetField.name.startsWith('__')) {
            const argumentNodes = field.arguments;
            if (argumentNodes != null) {
                const argumentNodeMap = argumentNodes.reduce((prev, argument) => ({
                    ...prev,
                    [argument.name.value]: argument,
                }), Object.create(null));
                for (const argument of targetField.args) {
                    const argName = argument.name;
                    const argType = argument.type;
                    const argumentNode = argumentNodeMap[argName];
                    const argValue = argumentNode === null || argumentNode === void 0 ? void 0 : argumentNode.value;
                    let value;
                    if (argValue != null) {
                        value = valueFromAST(argValue, argType, variableValues);
                        if (value == null) {
                            value = valueFromASTUntyped(argValue, variableValues);
                        }
                    }
                    const transformedValue = transformInputValue(argType, value, (t, v) => {
                        const newValue = this.inputValueTransformer(t.name, v);
                        return newValue === undefined ? v : newValue;
                    });
                    if (argValue.kind === Kind.VARIABLE) {
                        variableValues[argValue.name.value] = transformedValue;
                    }
                    else {
                        const newValueNode = astFromValue(transformedValue, argType);
                        argumentNodeMap[argName] = {
                            ...argumentNode,
                            value: newValueNode,
                        };
                    }
                }
                return {
                    ...field,
                    arguments: Object.values(argumentNodeMap),
                };
            }
        }
    }
}
