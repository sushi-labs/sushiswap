import { EnvelopError } from '@envelop/core';
import { GraphQLError } from 'graphql';
declare module 'graphql' {
    interface GraphQLHTTPErrorExtensions {
        status?: number;
        headers?: Record<string, string>;
    }
    interface GraphQLErrorExtensions {
        http?: GraphQLHTTPErrorExtensions;
    }
}
export { EnvelopError as GraphQLYogaError };
export declare function handleError(error: unknown, errors?: GraphQLError[]): GraphQLError[];
