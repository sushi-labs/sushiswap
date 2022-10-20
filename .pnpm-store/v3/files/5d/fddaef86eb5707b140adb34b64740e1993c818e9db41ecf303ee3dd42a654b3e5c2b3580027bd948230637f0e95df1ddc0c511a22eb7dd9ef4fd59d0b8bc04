import { EnvelopError } from '@envelop/core';
import { createGraphQLError } from '@graphql-tools/utils';
import { GraphQLError } from 'graphql';
export { EnvelopError as GraphQLYogaError };
function isAggregateError(obj) {
    return obj != null && typeof obj === 'object' && 'errors' in obj;
}
function hasToString(obj) {
    return obj != null && typeof obj.toString === 'function';
}
export function handleError(error, errors = []) {
    if (isAggregateError(error)) {
        for (const singleError of error.errors) {
            errors.push(...handleError(singleError));
        }
    }
    else if (error instanceof GraphQLError) {
        errors.push(error);
    }
    else if (error instanceof Error) {
        errors.push(createGraphQLError(error.message));
    }
    else if (typeof error === 'string') {
        errors.push(createGraphQLError(error));
    }
    else if (hasToString(error)) {
        errors.push(createGraphQLError(error.toString()));
    }
    else {
        errors.push(createGraphQLError('Unexpected error!'));
    }
    return errors;
}
