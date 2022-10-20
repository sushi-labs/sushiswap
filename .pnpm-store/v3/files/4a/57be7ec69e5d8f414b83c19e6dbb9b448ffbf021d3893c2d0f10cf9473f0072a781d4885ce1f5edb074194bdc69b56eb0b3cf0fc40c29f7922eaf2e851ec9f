import { GraphQLSchema, GraphQLError, Source } from 'graphql';
export interface InvalidDocument {
    source: Source;
    errors: GraphQLError[];
    deprecated: GraphQLError[];
}
export interface ValidateOptions {
    /**
     * Fails on duplicated fragment names
     * @default true
     */
    strictFragments?: boolean;
    /**
     * Fails on deprecated usage
     * @default true
     */
    strictDeprecated?: boolean;
    /**
     * Works only with combination of `apollo`
     * @default false
     */
    keepClientFields?: boolean;
    /**
     * Supports Apollo directives (`@client` and `@connection`)
     * @default false
     */
    apollo?: boolean;
    /**
     * Fails when operation depth exceeds maximum depth
     * @default false
     */
    maxDepth?: number;
}
export declare function validate(schema: GraphQLSchema, sources: Source[], options?: ValidateOptions): InvalidDocument[];
