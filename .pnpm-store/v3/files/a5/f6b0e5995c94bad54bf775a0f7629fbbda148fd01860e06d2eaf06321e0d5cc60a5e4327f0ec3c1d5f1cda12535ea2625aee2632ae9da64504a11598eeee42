import { BatchRequestDocument, ClientError, RequestDocument, Variables } from './types';
import * as Dom from './types.dom';
export { BatchRequestDocument, ClientError, RequestDocument, Variables };
/**
 * todo
 */
export declare class GraphQLClient {
    private url;
    private options;
    constructor(url: string, options?: Dom.RequestInit);
    rawRequest<T = any, V = Variables>(query: string, variables?: V, requestHeaders?: Dom.RequestInit['headers']): Promise<{
        data: T;
        extensions?: any;
        headers: Dom.Headers;
        status: number;
    }>;
    /**
     * Send a GraphQL document to the server.
     */
    request<T = any, V = Variables>(document: RequestDocument, variables?: V, requestHeaders?: Dom.RequestInit['headers']): Promise<T>;
    /**
     * Send a GraphQL document to the server.
     */
    batchRequests<T extends any = any, V = Variables>(documents: BatchRequestDocument<V>[], requestHeaders?: Dom.RequestInit['headers']): Promise<T>;
    setHeaders(headers: Dom.RequestInit['headers']): GraphQLClient;
    /**
     * Attach a header to the client. All subsequent requests will have this header.
     */
    setHeader(key: string, value: string): GraphQLClient;
    /**
     * Change the client endpoint. All subsequent requests will send to this endpoint.
     */
    setEndpoint(value: string): GraphQLClient;
}
/**
 * todo
 */
export declare function rawRequest<T = any, V = Variables>(url: string, query: string, variables?: V, requestHeaders?: Dom.RequestInit['headers']): Promise<{
    data: T;
    extensions?: any;
    headers: Dom.Headers;
    status: number;
}>;
/**
 * Send a GraphQL Document to the GraphQL server for exectuion.
 *
 * @example
 *
 * ```ts
 * // You can pass a raw string
 *
 * await request('https://foo.bar/graphql', `
 *   {
 *     query {
 *       users
 *     }
 *   }
 * `)
 *
 * // You can also pass a GraphQL DocumentNode. Convenient if you
 * // are using graphql-tag package.
 *
 * import gql from 'graphql-tag'
 *
 * await request('https://foo.bar/graphql', gql`...`)
 *
 * // If you don't actually care about using DocumentNode but just
 * // want the tooling support for gql template tag like IDE syntax
 * // coloring and prettier autoformat then note you can use the
 * // passthrough gql tag shipped with graphql-request to save a bit
 * // of performance and not have to install another dep into your project.
 *
 * import { gql } from 'graphql-request'
 *
 * await request('https://foo.bar/graphql', gql`...`)
 * ```
 */
export declare function request<T = any, V = Variables>(url: string, document: RequestDocument, variables?: V, requestHeaders?: Dom.RequestInit['headers']): Promise<T>;
/**
 * Send a batch of GraphQL Document to the GraphQL server for exectuion.
 *
 * @example
 *
 * ```ts
 * // You can pass a raw string
 *
 * await batchRequests('https://foo.bar/graphql', [
 * {
 *  query: `
 *   {
 *     query {
 *       users
 *     }
 *   }`
 * },
 * {
 *   query: `
 *   {
 *     query {
 *       users
 *     }
 *   }`
 * }])
 *
 * // You can also pass a GraphQL DocumentNode as query. Convenient if you
 * // are using graphql-tag package.
 *
 * import gql from 'graphql-tag'
 *
 * await batchRequests('https://foo.bar/graphql', [{ query: gql`...` }])
 * ```
 */
export declare function batchRequests<T extends any = any, V = Variables>(url: string, documents: BatchRequestDocument<V>[], requestHeaders?: Dom.RequestInit['headers']): Promise<T>;
export default request;
/**
 * Convenience passthrough template tag to get the benefits of tooling for the gql template tag. This does not actually parse the input into a GraphQL DocumentNode like graphql-tag package does. It just returns the string with any variables given interpolated. Can save you a bit of performance and having to install another package.
 *
 * @example
 *
 * import { gql } from 'graphql-request'
 *
 * await request('https://foo.bar/graphql', gql`...`)
 *
 * @remarks
 *
 * Several tools in the Node GraphQL ecosystem are hardcoded to specially treat any template tag named "gql". For example see this prettier issue: https://github.com/prettier/prettier/issues/4360. Using this template tag has no runtime effect beyond variable interpolation.
 */
export declare function gql(chunks: TemplateStringsArray, ...variables: any[]): string;
