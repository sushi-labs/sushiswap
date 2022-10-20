"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
class MapLeafValues {
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
    transformSchema(originalWrappingSchema, _subschemaConfig, _transformedSchema) {
        this.originalWrappingSchema = originalWrappingSchema;
        const typeMap = originalWrappingSchema.getTypeMap();
        for (const typeName in typeMap) {
            const type = typeMap[typeName];
            if (!typeName.startsWith('__')) {
                if ((0, graphql_1.isLeafType)(type)) {
                    this.resultVisitorMap[typeName] = (value) => this.outputValueTransformer(typeName, value);
                }
            }
        }
        this.typeInfo = new graphql_1.TypeInfo(originalWrappingSchema);
        return originalWrappingSchema;
    }
    transformRequest(originalRequest, _delegationContext, transformationContext) {
        var _a;
        const document = originalRequest.document;
        const variableValues = (_a = originalRequest.variables) !== null && _a !== void 0 ? _a : {};
        const operations = document.definitions.filter(def => def.kind === graphql_1.Kind.OPERATION_DEFINITION);
        const fragments = document.definitions.filter(def => def.kind === graphql_1.Kind.FRAGMENT_DEFINITION);
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
        return (0, utils_1.visitResult)(originalResult, transformationContext.transformedRequest, this._getOriginalWrappingSchema(), this.resultVisitorMap);
    }
    transformOperations(operations, variableValues) {
        return operations.map((operation) => {
            var _a;
            const variableDefinitionMap = ((_a = operation.variableDefinitions) !== null && _a !== void 0 ? _a : []).reduce((prev, def) => ({
                ...prev,
                [def.variable.name.value]: def,
            }), {});
            const newOperation = (0, graphql_1.visit)(operation, (0, graphql_1.visitWithTypeInfo)(this._getTypeInfo(), {
                [graphql_1.Kind.FIELD]: node => this.transformFieldNode(node, variableDefinitionMap, variableValues),
            }));
            return {
                ...newOperation,
                variableDefinitions: Object.values(variableDefinitionMap),
            };
        });
    }
    transformFieldNode(field, variableDefinitionMap, variableValues) {
        const targetField = this._getTypeInfo().getFieldDef();
        if (!targetField) {
            return;
        }
        const generateVariableName = (0, utils_1.createVariableNameGenerator)(variableDefinitionMap);
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
                        value = (0, graphql_1.valueFromAST)(argValue, argType, variableValues);
                    }
                    (0, utils_1.updateArgument)(argumentNodeMap, variableDefinitionMap, variableValues, argName, generateVariableName(argName), argType, (0, utils_1.transformInputValue)(argType, value, (t, v) => {
                        const newValue = this.inputValueTransformer(t.name, v);
                        return newValue === undefined ? v : newValue;
                    }));
                }
                return {
                    ...field,
                    arguments: Object.values(argumentNodeMap),
                };
            }
        }
    }
}
exports.default = MapLeafValues;
