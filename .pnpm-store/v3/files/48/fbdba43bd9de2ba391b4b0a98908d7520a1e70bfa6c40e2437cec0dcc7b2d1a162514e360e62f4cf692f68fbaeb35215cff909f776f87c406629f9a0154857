"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const delegate_1 = require("@graphql-tools/delegate");
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const DEFAULTS = {
    if: true,
    validateSchema: true,
    limitOfRecords: 1000,
    firstArgumentName: 'first',
    skipArgumentName: 'skip',
    lastIdArgumentName: 'where.id_gte',
    skipArgumentLimit: 5000,
};
const validateSchema = (0, utils_1.memoize2)(function validateSchema(schema, config) {
    const queryType = schema.getQueryType();
    if (queryType == null) {
        throw new Error(`Make sure you have a query type in this source before applying Block Tracking`);
    }
    const queryFields = queryType.getFields();
    for (const fieldName in queryFields) {
        if (fieldName.startsWith('_')) {
            continue;
        }
        const field = queryFields[fieldName];
        const nullableType = (0, graphql_1.isNonNullType)(field.type) ? field.type.ofType : field.type;
        if ((0, graphql_1.isListType)(nullableType)) {
            if (!field.args.some((arg) => arg.name === config.firstArgumentName)) {
                throw new Error(`Make sure you have a ${config.firstArgumentName} argument in the query field ${fieldName}`);
            }
            if (!field.args.some((arg) => arg.name === config.skipArgumentName)) {
                throw new Error(`Make sure you have a ${config.skipArgumentName} argument in the query field ${fieldName}`);
            }
        }
    }
});
/*
const getQueryFieldNames = memoize1(function getQueryFields(schema: GraphQLSchema) {
  const queryType = schema.getQueryType()
  if (queryType == null) {
    throw new Error(`Make sure you have a query type in this source before applying Block Tracking`)
  }
  return Object.keys(queryType.getFields())
}) */
class AutoPaginationTransform {
    constructor({ config } = {}) {
        this.config = { ...DEFAULTS, ...config };
        if (this.config.if === false) {
            return {};
        }
    }
    transformSchema(schema, subschemaConfig) {
        if (this.config.validateSchema) {
            validateSchema(subschemaConfig.schema, this.config);
        }
        if (schema != null) {
            const queryType = schema.getQueryType();
            if (queryType != null) {
                const queryFields = queryType.getFields();
                for (const fieldName in queryFields) {
                    if (!fieldName.startsWith('_')) {
                        const field = queryFields[fieldName];
                        const existingResolver = field.resolve;
                        field.resolve = async (root, args, context, info) => {
                            const totalRecords = args[this.config.firstArgumentName] || this.config.limitOfRecords;
                            const initialSkipValue = args[this.config.skipArgumentName] || 0;
                            if (totalRecords >= this.config.skipArgumentLimit * 2) {
                                let remainingRecords = totalRecords;
                                const records = [];
                                while (remainingRecords > 0) {
                                    let skipValue = records.length === 0 ? initialSkipValue : 0;
                                    const lastIdValue = records.length > 0 ? records[records.length - 1].id : null;
                                    while (skipValue < this.config.skipArgumentLimit && remainingRecords > 0) {
                                        const newArgs = {
                                            ...args,
                                        };
                                        if (lastIdValue) {
                                            lodash_1.default.set(newArgs, this.config.lastIdArgumentName, lastIdValue);
                                        }
                                        lodash_1.default.set(newArgs, this.config.skipArgumentName, skipValue);
                                        const askedRecords = Math.min(remainingRecords, this.config.skipArgumentLimit);
                                        lodash_1.default.set(newArgs, this.config.firstArgumentName, askedRecords);
                                        const result = await (0, delegate_1.delegateToSchema)({
                                            schema,
                                            fieldName,
                                            args: newArgs,
                                            context,
                                            info,
                                        });
                                        if (!Array.isArray(result)) {
                                            return result;
                                        }
                                        records.push(...result);
                                        skipValue += askedRecords;
                                        remainingRecords -= askedRecords;
                                    }
                                }
                                return records;
                            }
                            return existingResolver(root, args, context, info);
                        };
                    }
                }
            }
        }
        return schema;
    }
    transformRequest(executionRequest, delegationContext) {
        const document = (0, graphql_1.visit)(executionRequest.document, {
            SelectionSet: {
                leave: (selectionSet) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    const newSelections = [];
                    for (const selectionNode of selectionSet.selections) {
                        if (selectionNode.kind === graphql_1.Kind.FIELD &&
                            !selectionNode.name.value.startsWith('_') &&
                            !((_a = selectionNode.arguments) === null || _a === void 0 ? void 0 : _a.some((argNode) => argNode.name.value === 'id'))) {
                            const existingArgs = [];
                            let firstArg;
                            let skipArg;
                            for (const existingArg of (_b = selectionNode.arguments) !== null && _b !== void 0 ? _b : []) {
                                if (existingArg.name.value === this.config.firstArgumentName) {
                                    firstArg = existingArg;
                                }
                                else if (existingArg.name.value === this.config.skipArgumentName) {
                                    skipArg = existingArg;
                                }
                                else {
                                    existingArgs.push(existingArg);
                                }
                            }
                            if (firstArg != null) {
                                let numberOfTotalRecords;
                                if (firstArg.value.kind === graphql_1.Kind.INT) {
                                    numberOfTotalRecords = parseInt(firstArg.value.value);
                                }
                                else if (firstArg.value.kind === graphql_1.Kind.VARIABLE) {
                                    numberOfTotalRecords = (_c = executionRequest.variables) === null || _c === void 0 ? void 0 : _c[firstArg.value.name.value];
                                }
                                if (numberOfTotalRecords != null && numberOfTotalRecords > this.config.limitOfRecords) {
                                    const fieldName = selectionNode.name.value;
                                    const aliasName = ((_d = selectionNode.alias) === null || _d === void 0 ? void 0 : _d.value) || fieldName;
                                    let initialSkip = 0;
                                    if (((_e = skipArg === null || skipArg === void 0 ? void 0 : skipArg.value) === null || _e === void 0 ? void 0 : _e.kind) === graphql_1.Kind.INT) {
                                        initialSkip = parseInt(skipArg.value.value);
                                    }
                                    else if (((_f = skipArg === null || skipArg === void 0 ? void 0 : skipArg.value) === null || _f === void 0 ? void 0 : _f.kind) === graphql_1.Kind.VARIABLE) {
                                        initialSkip = (_g = executionRequest.variables) === null || _g === void 0 ? void 0 : _g[skipArg.value.name.value];
                                    }
                                    let skip;
                                    for (skip = initialSkip; numberOfTotalRecords - skip + initialSkip > 0; skip += this.config.limitOfRecords) {
                                        newSelections.push({
                                            ...selectionNode,
                                            alias: {
                                                kind: graphql_1.Kind.NAME,
                                                value: `splitted_${skip}_${aliasName}`,
                                            },
                                            arguments: [
                                                ...existingArgs,
                                                {
                                                    kind: graphql_1.Kind.ARGUMENT,
                                                    name: {
                                                        kind: graphql_1.Kind.NAME,
                                                        value: this.config.firstArgumentName,
                                                    },
                                                    value: {
                                                        kind: graphql_1.Kind.INT,
                                                        value: Math.min(numberOfTotalRecords - skip + initialSkip, this.config.limitOfRecords).toString(),
                                                    },
                                                },
                                                {
                                                    kind: graphql_1.Kind.ARGUMENT,
                                                    name: {
                                                        kind: graphql_1.Kind.NAME,
                                                        value: this.config.skipArgumentName,
                                                    },
                                                    value: {
                                                        kind: graphql_1.Kind.INT,
                                                        value: skip.toString(),
                                                    },
                                                },
                                            ],
                                        });
                                    }
                                    continue;
                                }
                            }
                        }
                        newSelections.push(selectionNode);
                    }
                    return {
                        ...selectionSet,
                        selections: newSelections,
                    };
                },
            },
        });
        return {
            ...executionRequest,
            document,
        };
    }
    transformResult(originalResult) {
        if (originalResult.data != null) {
            return {
                ...originalResult,
                data: mergeSplittedResults(originalResult.data),
            };
        }
        return originalResult;
    }
}
exports.default = AutoPaginationTransform;
function mergeSplittedResults(originalData) {
    if (originalData != null && typeof originalData === 'object') {
        if (Array.isArray(originalData)) {
            return originalData.map((record) => mergeSplittedResults(record));
        }
        const finalData = {};
        for (const fullAliasName in originalData) {
            if (fullAliasName.startsWith('splitted_')) {
                const [, , ...rest] = fullAliasName.split('_');
                const aliasName = rest.join('_');
                finalData[aliasName] = finalData[aliasName] || [];
                for (const record of originalData[fullAliasName]) {
                    finalData[aliasName].push(mergeSplittedResults(record));
                }
            }
            else {
                finalData[fullAliasName] = mergeSplittedResults(originalData[fullAliasName]);
            }
        }
        return finalData;
    }
    return originalData;
}
