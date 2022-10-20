"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.GraphQLYogaError = void 0;
const core_1 = require("@envelop/core");
Object.defineProperty(exports, "GraphQLYogaError", { enumerable: true, get: function () { return core_1.EnvelopError; } });
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
function isAggregateError(obj) {
    return obj != null && typeof obj === 'object' && 'errors' in obj;
}
function hasToString(obj) {
    return obj != null && typeof obj.toString === 'function';
}
function handleError(error, errors = []) {
    if (isAggregateError(error)) {
        for (const singleError of error.errors) {
            errors.push(...handleError(singleError));
        }
    }
    else if (error instanceof graphql_1.GraphQLError) {
        errors.push(error);
    }
    else if (error instanceof Error) {
        errors.push((0, utils_1.createGraphQLError)(error.message));
    }
    else if (typeof error === 'string') {
        errors.push((0, utils_1.createGraphQLError)(error));
    }
    else if (hasToString(error)) {
        errors.push((0, utils_1.createGraphQLError)(error.toString()));
    }
    else {
        errors.push((0, utils_1.createGraphQLError)('Unexpected error!'));
    }
    return errors;
}
exports.handleError = handleError;
