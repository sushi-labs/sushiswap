"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
const DEFAULTS = {
    if: true,
    validateSchema: true,
    ignoreOperationNames: [],
    ignoreFieldNames: [],
    metaTypeName: '_Meta_',
    blockFieldName: 'block',
    blockNumberFieldName: 'number',
    metaRootFieldName: '_meta',
    blockArgumentName: 'block',
    minBlockArgumentName: 'number_gte',
};
const createMetaSelectionNode = (0, utils_1.memoize1)(function createMetaSelectionNode(config) {
    return {
        kind: graphql_1.Kind.FIELD,
        name: {
            kind: graphql_1.Kind.NAME,
            value: config.metaRootFieldName,
        },
        selectionSet: {
            kind: graphql_1.Kind.SELECTION_SET,
            selections: [
                {
                    kind: graphql_1.Kind.FIELD,
                    name: {
                        kind: graphql_1.Kind.NAME,
                        value: config.blockFieldName,
                    },
                    selectionSet: {
                        kind: graphql_1.Kind.SELECTION_SET,
                        selections: [
                            {
                                kind: graphql_1.Kind.FIELD,
                                name: {
                                    kind: graphql_1.Kind.NAME,
                                    value: config.blockNumberFieldName,
                                },
                            },
                        ],
                    },
                },
            ],
        },
    };
});
const validateSchema = (0, utils_1.memoize2)(function validateSchema(schema, config) {
    const metaType = schema.getType(config.metaTypeName);
    if (metaType == null || !(0, graphql_1.isObjectType)(metaType)) {
        throw new Error(`Make sure you have a type named "${config.metaTypeName}" in this source before applying Block Tracking`);
    }
    const blockField = metaType.getFields()[config.blockFieldName];
    if (blockField == null) {
        throw new Error(`Make sure you have a type named "${config.metaTypeName}" with "${config.blockFieldName}" field in this source before applying Block Tracking`);
    }
    const blockType = (0, graphql_1.getNamedType)(blockField.type);
    if (!(0, graphql_1.isObjectType)(blockType)) {
        throw new Error(`Make sure you have a correct block type in this source before applying Block Tracking`);
    }
    const blockNumberField = blockType.getFields()[config.blockNumberFieldName];
    if (blockNumberField == null) {
        throw new Error(`Make sure you have a correct block type with "${config.blockNumberFieldName}" field in this source before applying Block Tracking`);
    }
    const queryType = schema.getQueryType();
    if (queryType == null) {
        throw new Error(`Make sure you have a query type in this source before applying Block Tracking`);
    }
    const queryFields = queryType.getFields();
    const metaQueryField = queryFields[config.metaRootFieldName];
    if (metaQueryField == null) {
        throw new Error(`Make sure you have a query type with "${config.metaRootFieldName}" field in this source before applying Block Tracking`);
    }
    const metaQueryFieldType = (0, graphql_1.getNamedType)(metaQueryField.type);
    if (!(0, graphql_1.isObjectType)(metaQueryFieldType) || metaQueryFieldType.name !== config.metaTypeName) {
        throw new Error(`Make sure you have a query type with "${config.metaRootFieldName}" field with the correct ${config.metaTypeName} type in this source before applying Block Tracking`);
    }
    for (const fieldName in queryFields) {
        if (fieldName === config.metaRootFieldName) {
            continue;
        }
        const field = queryFields[fieldName];
        const blockArgument = field.args.find((arg) => arg.name === config.blockArgumentName);
        if (blockArgument == null) {
            throw new Error(`Make sure you have query root fields with "${config.blockArgumentName}" argument in this source before applying Block Tracking`);
        }
        const blockArgumentType = (0, graphql_1.getNamedType)(blockArgument.type);
        if (!(0, graphql_1.isInputObjectType)(blockArgumentType)) {
            throw new Error(`Make sure you have query root fields with "${config.blockArgumentName}" argument returning correct type in this source before applying Block Tracking`);
        }
        const blockArgumentFields = blockArgumentType.getFields();
        const minBlockArgument = blockArgumentFields[config.minBlockArgumentName];
        if (minBlockArgument == null) {
            throw new Error(`Make sure you have query root fields with "${config.blockArgumentName}" argument with "${config.minBlockArgumentName}" field in this source before applying Block Tracking`);
        }
    }
});
const getQueryFieldNames = (0, utils_1.memoize1)(function getQueryFields(schema) {
    const queryType = schema.getQueryType();
    if (queryType == null) {
        throw new Error(`Make sure you have a query type in this source before applying Block Tracking`);
    }
    return Object.keys(queryType.getFields());
});
const metaFieldAddedByContext = new WeakMap();
function getRequestIdentifier(delegationContext) {
    var _a, _b, _c;
    return (_b = (_a = delegationContext.context) !== null && _a !== void 0 ? _a : delegationContext.rootValue) !== null && _b !== void 0 ? _b : (_c = delegationContext.info) === null || _c === void 0 ? void 0 : _c.operation;
}
const schemaMinBlockMap = new WeakMap();
class BlockTrackingTransform {
    constructor({ config } = {}) {
        this.config = {
            ...DEFAULTS,
            ...config,
        };
        if (!this.config.if) {
            return {};
        }
    }
    transformSchema(schema, subschemaConfig) {
        if (this.config.validateSchema) {
            validateSchema(subschemaConfig.schema, this.config);
        }
        return schema;
    }
    transformRequest(executionRequest, delegationContext) {
        if (executionRequest.operationName != null &&
            this.config.ignoreOperationNames.includes(executionRequest.operationName)) {
            return executionRequest;
        }
        const minBlock = schemaMinBlockMap.get(delegationContext.subschema);
        const document = (0, graphql_1.visit)(executionRequest.document, {
            Field: {
                leave: (fieldSelectionNode) => {
                    var _a;
                    if (minBlock != null &&
                        !fieldSelectionNode.name.value.startsWith('_') &&
                        !this.config.ignoreFieldNames.includes(fieldSelectionNode.name.value) &&
                        getQueryFieldNames(delegationContext.transformedSchema).includes(fieldSelectionNode.name.value)) {
                        const argNodes = ((_a = fieldSelectionNode.arguments) === null || _a === void 0 ? void 0 : _a.filter((argument) => argument.name.value !== this.config.blockArgumentName)) || [];
                        const blockArgument = argNodes.find((argument) => argument.name.value === this.config.blockArgumentName) || {
                            kind: graphql_1.Kind.ARGUMENT,
                            name: {
                                kind: graphql_1.Kind.NAME,
                                value: this.config.blockArgumentName,
                            },
                            value: {
                                kind: graphql_1.Kind.OBJECT,
                                fields: [],
                            },
                        };
                        const blockArgumentFields = blockArgument.value.fields;
                        if (!blockArgumentFields.some((field) => field.name.value === this.config.minBlockArgumentName)) {
                            return {
                                ...fieldSelectionNode,
                                arguments: [
                                    ...argNodes,
                                    {
                                        ...blockArgument,
                                        value: {
                                            ...blockArgument.value,
                                            fields: [
                                                ...blockArgumentFields,
                                                {
                                                    kind: graphql_1.Kind.OBJECT_FIELD,
                                                    name: {
                                                        kind: graphql_1.Kind.NAME,
                                                        value: this.config.minBlockArgumentName,
                                                    },
                                                    value: {
                                                        kind: graphql_1.Kind.INT,
                                                        value: minBlock.toString(),
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            };
                        }
                    }
                    return fieldSelectionNode;
                },
            },
            OperationDefinition: {
                leave: (operationNode) => {
                    var _a;
                    const requestIdentifier = getRequestIdentifier(delegationContext);
                    let shouldAddMetaField = true;
                    if ((_a = delegationContext.subschemaConfig) === null || _a === void 0 ? void 0 : _a.batch) {
                        if (requestIdentifier != null) {
                            const isAddedBefore = metaFieldAddedByContext.get(requestIdentifier);
                            if (isAddedBefore != null) {
                                shouldAddMetaField = !isAddedBefore;
                            }
                        }
                    }
                    if (operationNode.operation === graphql_1.OperationTypeNode.QUERY && shouldAddMetaField) {
                        const metaSelectionNode = createMetaSelectionNode(this.config);
                        metaFieldAddedByContext.set(requestIdentifier, true);
                        return {
                            ...operationNode,
                            selectionSet: {
                                ...operationNode.selectionSet,
                                selections: [...operationNode.selectionSet.selections, metaSelectionNode],
                            },
                        };
                    }
                    return operationNode;
                },
            },
        });
        return {
            ...executionRequest,
            document,
        };
    }
    transformResult(originalResult, delegationContext) {
        var _a, _b, _c;
        const newBlockNumber = (_c = (_b = (_a = originalResult.data) === null || _a === void 0 ? void 0 : _a[this.config.metaRootFieldName]) === null || _b === void 0 ? void 0 : _b[this.config.blockFieldName]) === null || _c === void 0 ? void 0 : _c[this.config.blockNumberFieldName];
        if (newBlockNumber != null) {
            const existingMinBlock = schemaMinBlockMap.get(delegationContext.subschema);
            if (existingMinBlock == null || newBlockNumber > existingMinBlock) {
                schemaMinBlockMap.set(delegationContext.subschema, newBlockNumber);
            }
        }
        return originalResult;
    }
}
exports.default = BlockTrackingTransform;
