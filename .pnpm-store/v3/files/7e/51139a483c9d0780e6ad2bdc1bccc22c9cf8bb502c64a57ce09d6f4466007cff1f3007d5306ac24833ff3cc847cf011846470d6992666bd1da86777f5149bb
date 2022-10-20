/// <reference types="ws" />
/// <reference lib="dom" />
import { IntrospectionOptions } from 'graphql';
import { AsyncExecutor, Executor, SyncExecutor, Source, Loader, BaseLoaderOptions } from '@graphql-tools/utils';
import { ClientOptions } from 'graphql-ws';
import WebSocket from 'isomorphic-ws';
import { AsyncFetchFn } from './defaultAsyncFetch.js';
import { SyncFetchFn } from './defaultSyncFetch.js';
export declare type FetchFn = AsyncFetchFn | SyncFetchFn;
export declare type AsyncImportFn = (moduleName: string) => PromiseLike<any>;
export declare type SyncImportFn = (moduleName: string) => any;
declare type HeadersConfig = Record<string, string>;
interface ExecutionExtensions {
    headers?: HeadersConfig;
    endpoint?: string;
}
export declare enum SubscriptionProtocol {
    WS = "WS",
    /**
     * Use legacy web socket protocol `graphql-ws` instead of the more current standard `graphql-transport-ws`
     */
    LEGACY_WS = "LEGACY_WS",
    /**
     * Use SSE for subscription instead of WebSocket
     */
    SSE = "SSE",
    /**
     * Use `graphql-sse` for subscriptions
     */
    GRAPHQL_SSE = "GRAPHQL_SSE"
}
/**
 * Additional options for loading from a URL
 */
export interface LoadFromUrlOptions extends BaseLoaderOptions, Partial<IntrospectionOptions> {
    /**
     * Additional headers to include when querying the original schema
     */
    headers?: HeadersConfig;
    /**
     * A custom `fetch` implementation to use when querying the original schema.
     * Defaults to `cross-fetch`
     */
    customFetch?: FetchFn | string;
    /**
     * HTTP method to use when querying the original schema.
     */
    method?: 'GET' | 'POST';
    /**
     * Custom WebSocket implementation used by the loaded schema if subscriptions
     * are enabled
     */
    webSocketImpl?: typeof WebSocket | string;
    /**
     * Whether to use the GET HTTP method for queries when querying the original schema
     */
    useGETForQueries?: boolean;
    /**
     * Handle URL as schema SDL
     */
    handleAsSDL?: boolean;
    /**
     * Regular HTTP endpoint; defaults to the pointer
     */
    endpoint?: string;
    /**
     * Subscriptions endpoint; defaults to the endpoint given as HTTP endpoint
     */
    subscriptionsEndpoint?: string;
    /**
     * Use specific protocol for subscriptions
     */
    subscriptionsProtocol?: SubscriptionProtocol;
    /**
     * Retry attempts
     */
    retry?: number;
    /**
     * Timeout in milliseconds
     */
    timeout?: number;
    /**
     * Request Credentials (default: 'same-origin')
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
     */
    credentials?: RequestCredentials;
    /**
     * Connection Parameters for WebSockets connection
     */
    connectionParams?: any;
    /**
     * Enable Batching
     */
    batch?: boolean;
    /**
     * @deprecated This is no longer used. Will be removed in the next release
     */
    graphqlSseOptions?: any;
    /**
     * @deprecated This is no longer used. Will be removed in the next release
     */
    multipart?: boolean;
}
/**
 * This loader loads a schema from a URL. The loaded schema is a fully-executable,
 * remote schema since it's created using [@graphql-tools/wrap](/docs/remote-schemas).
 *
 * ```
 * const schema = await loadSchema('http://localhost:3000/graphql', {
 *   loaders: [
 *     new UrlLoader(),
 *   ]
 * });
 * ```
 */
export declare class UrlLoader implements Loader<LoadFromUrlOptions> {
    createFormDataFromVariables<TVariables>({ query, variables, operationName, extensions, }: {
        query: string;
        variables: TVariables;
        operationName?: string;
        extensions?: any;
    }): string | FormData | Promise<FormData>;
    prepareGETUrl({ baseUrl, query, variables, operationName, extensions, }: {
        baseUrl: string;
        query: string;
        variables: any;
        operationName?: string;
        extensions?: any;
    }): string;
    buildHTTPExecutor(endpoint: string, fetch: SyncFetchFn, options?: LoadFromUrlOptions): SyncExecutor<any, ExecutionExtensions>;
    buildHTTPExecutor(endpoint: string, fetch: AsyncFetchFn, options?: LoadFromUrlOptions): AsyncExecutor<any, ExecutionExtensions>;
    buildWSExecutor(subscriptionsEndpoint: string, webSocketImpl: typeof WebSocket, connectionParams?: ClientOptions['connectionParams']): Executor;
    buildWSLegacyExecutor(subscriptionsEndpoint: string, WebSocketImpl: typeof WebSocket, options?: LoadFromUrlOptions): Executor;
    getFetch(customFetch: LoadFromUrlOptions['customFetch'], importFn: AsyncImportFn): PromiseLike<AsyncFetchFn> | AsyncFetchFn;
    getFetch(customFetch: LoadFromUrlOptions['customFetch'], importFn: SyncImportFn): SyncFetchFn;
    private getDefaultMethodFromOptions;
    getWebSocketImpl(importFn: AsyncImportFn, options?: LoadFromUrlOptions): PromiseLike<typeof WebSocket>;
    getWebSocketImpl(importFn: SyncImportFn, options?: LoadFromUrlOptions): typeof WebSocket;
    buildSubscriptionExecutor(subscriptionsEndpoint: string, fetch: SyncFetchFn, syncImport: SyncImportFn, options?: LoadFromUrlOptions): SyncExecutor;
    buildSubscriptionExecutor(subscriptionsEndpoint: string, fetch: AsyncFetchFn, asyncImport: AsyncImportFn, options?: LoadFromUrlOptions): AsyncExecutor;
    getExecutor(endpoint: string, asyncImport: AsyncImportFn, options?: Omit<LoadFromUrlOptions, 'endpoint'>): AsyncExecutor;
    getExecutor(endpoint: string, syncImport: SyncImportFn, options?: Omit<LoadFromUrlOptions, 'endpoint'>): SyncExecutor;
    getExecutorAsync(endpoint: string, options?: Omit<LoadFromUrlOptions, 'endpoint'>): AsyncExecutor;
    getExecutorSync(endpoint: string, options?: Omit<LoadFromUrlOptions, 'endpoint'>): SyncExecutor;
    handleSDL(pointer: string, fetch: SyncFetchFn, options: LoadFromUrlOptions): Source;
    handleSDL(pointer: string, fetch: AsyncFetchFn, options: LoadFromUrlOptions): Promise<Source>;
    load(pointer: string, options: LoadFromUrlOptions): Promise<Source[]>;
    loadSync(pointer: string, options: LoadFromUrlOptions): Source[];
}
export {};
