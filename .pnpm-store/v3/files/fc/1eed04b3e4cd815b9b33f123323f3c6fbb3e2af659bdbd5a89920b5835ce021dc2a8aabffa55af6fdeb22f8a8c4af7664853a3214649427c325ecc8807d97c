"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponseInitByRespectingErrors = exports.handleError = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
function isAggregateError(obj) {
    return obj != null && typeof obj === 'object' && 'errors' in obj;
}
function hasToString(obj) {
    return obj != null && typeof obj.toString === 'function';
}
function handleError(error, maskedErrorsOpts, errors = []) {
    if (isAggregateError(error)) {
        for (const singleError of error.errors) {
            errors.push(...handleError(singleError, maskedErrorsOpts));
        }
    }
    else if (maskedErrorsOpts) {
        const maskedError = maskedErrorsOpts.formatError(error, maskedErrorsOpts.errorMessage, maskedErrorsOpts.isDev);
        errors.push(maskedError);
    }
    else {
        if (error instanceof graphql_1.GraphQLError) {
            errors.push(error);
        }
        if (error instanceof Error) {
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
    }
    return errors;
}
exports.handleError = handleError;
function getResponseInitByRespectingErrors(result, headers = {}) {
    let status;
    if ('errors' in result && result.errors?.length) {
        for (const error of result.errors) {
            if (error.extensions?.http) {
                if (error.extensions.http.status &&
                    (!status || error.extensions.http.status > status)) {
                    status = error.extensions.http.status;
                }
                if (error.extensions.http.headers) {
                    Object.assign(headers, error.extensions.http.headers);
                }
            }
        }
    }
    else {
        status = 200;
    }
    if (!status) {
        // there should always be a concrete status provided (avoids responding with the default 200 status codes on erroneous results)
        status = 500;
    }
    return {
        status,
        headers,
    };
}
exports.getResponseInitByRespectingErrors = getResponseInitByRespectingErrors;
