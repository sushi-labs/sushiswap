import { Plugin } from '@envelop/types';
import { GraphQLError, GraphQLErrorExtensions } from 'graphql';
export declare const DEFAULT_ERROR_MESSAGE = "Unexpected error.";
export declare class EnvelopError extends GraphQLError {
    constructor(message: string, extensions?: GraphQLErrorExtensions);
}
export declare type FormatErrorHandler = (error: GraphQLError | unknown, message: string, isDev: boolean) => GraphQLError;
export declare const formatError: FormatErrorHandler;
export declare type UseMaskedErrorsOpts = {
    /** The function used for format/identify errors. */
    formatError?: FormatErrorHandler;
    /** The error message that shall be used for masked errors. */
    errorMessage?: string;
    /**
     * Additional information that is forwarded to the `formatError` function.
     * The default value is `process.env['NODE_ENV'] === 'development'`
     */
    isDev?: boolean;
    /**
     * Whether parse errors should be processed by this plugin.
     * In general it is not recommend to set this flag to `true`
     * as a `parse` error contains useful information for debugging a GraphQL operation.
     * A `parse` error never contains any sensitive information.
     * @default false
     */
    handleParseErrors?: boolean;
    /**
     * Whether validation errors should processed by this plugin.
     * In general we recommend against setting this flag to `true`
     * as a `validate` error contains useful information for debugging a GraphQL operation.
     * A `validate` error contains "did you mean x" suggestions that make it easier
     * to reverse-introspect a GraphQL schema whose introspection capabilities got disabled.
     * Instead of disabling introspection and masking validation errors, using persisted operations
     * is a safer solution for avoiding the execution of unwanted/arbitrary operations.
     * @default false
     */
    handleValidationErrors?: boolean;
};
export declare const useMaskedErrors: (opts?: UseMaskedErrorsOpts) => Plugin;
