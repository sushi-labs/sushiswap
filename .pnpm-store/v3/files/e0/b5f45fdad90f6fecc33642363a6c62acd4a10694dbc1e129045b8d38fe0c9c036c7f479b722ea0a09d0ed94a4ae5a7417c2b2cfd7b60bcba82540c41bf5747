import { GraphQLSchema } from 'graphql';
import { GetEnvelopedFn, UseMaskedErrorsOpts, PromiseOrValue } from '@envelop/core';
import { ValidationCache } from '@envelop/validation-cache';
import { ParserCacheOptions } from '@envelop/parser-cache';
import { ExecutionResult, IResolvers, TypeSource } from '@graphql-tools/utils';
import { GraphQLServerInject, YogaInitialContext, FetchAPI } from './types.js';
import { Plugin } from './plugins/types.js';
import { YogaLogger } from './logger.js';
import { CORSPluginOptions } from './plugins/useCORS.js';
import { GraphiQLOptions, GraphiQLOptionsOrFactory } from './plugins/useGraphiQL.js';
interface OptionsWithPlugins<TContext> {
    /**
     * Envelop Plugins
     * @see https://envelop.dev/plugins
     */
    plugins: Array<Plugin<TContext> | Plugin | {}>;
}
/**
 * Configuration options for the server
 */
export declare type YogaServerOptions<TServerContext extends Record<string, any>, TUserContext extends Record<string, any>, TRootValue> = {
    /**
     * Enable/disable logging or provide a custom logger.
     * @default true
     */
    logging?: boolean | YogaLogger;
    /**
     * Prevent leaking unexpected errors to the client. We highly recommend enabling this in production.
     * If you throw `GraphQLYogaError`/`EnvelopError` within your GraphQL resolvers then that error will be sent back to the client.
     *
     * You can lean more about this here:
     * @see https://graphql-yoga.vercel.app/docs/features/error-masking
     *
     * Default: `true`
     */
    maskedErrors?: boolean | UseMaskedErrorsOpts;
    /**
     * Context
     */
    context?: ((initialContext: YogaInitialContext & TServerContext) => Promise<TUserContext> | TUserContext) | Promise<TUserContext> | TUserContext;
    cors?: CORSPluginOptions<TServerContext>;
    /**
     * GraphQL endpoint
     */
    endpoint?: string;
    /**
     * GraphiQL options
     *
     * Default: `true`
     */
    graphiql?: GraphiQLOptionsOrFactory<TServerContext>;
    renderGraphiQL?: (options?: GraphiQLOptions) => PromiseOrValue<BodyInit>;
    schema?: GraphQLSchema | {
        typeDefs: TypeSource;
        resolvers?: IResolvers<TRootValue, TUserContext & TServerContext & YogaInitialContext> | Array<IResolvers<TRootValue, TUserContext & TServerContext & YogaInitialContext>>;
    };
    parserCache?: boolean | ParserCacheOptions;
    validationCache?: boolean | ValidationCache;
    fetchAPI?: Partial<FetchAPI>;
    multipart?: boolean;
    id?: string;
} & Partial<OptionsWithPlugins<TUserContext & TServerContext & YogaInitialContext>>;
export declare function getDefaultSchema(): GraphQLSchema;
/**
 * Base class that can be extended to create a GraphQL server with any HTTP server framework.
 * @internal
 */
export declare class YogaServer<TServerContext extends Record<string, any>, TUserContext extends Record<string, any>, TRootValue> {
    /**
     * Instance of envelop
     */
    readonly getEnveloped: GetEnvelopedFn<TUserContext & TServerContext & YogaInitialContext>;
    logger: YogaLogger;
    protected endpoint?: string;
    protected fetchAPI: FetchAPI;
    protected plugins: Array<Plugin<TUserContext & TServerContext & YogaInitialContext, TServerContext>>;
    private onRequestParseHooks;
    private onRequestHooks;
    private onResultProcessHooks;
    private onResponseHooks;
    private id;
    constructor(options?: YogaServerOptions<TServerContext, TUserContext, TRootValue>);
    getResponse(request: Request, ...args: {} extends TServerContext ? [serverContext?: TServerContext | undefined] : [serverContext: TServerContext]): Promise<Response>;
    handleRequest: (request: Request, ...args: {} extends TServerContext ? [serverContext?: TServerContext | undefined] : [serverContext: TServerContext]) => Promise<Response>;
    /**
     * Testing utility to mock http request for GraphQL endpoint
     *
     *
     * Example - Test a simple query
     * ```ts
     * const { response, executionResult } = await yoga.inject({
     *  document: "query { ping }",
     * })
     * expect(response.status).toBe(200)
     * expect(executionResult.data.ping).toBe('pong')
     * ```
     **/
    inject<TData = any, TVariables = any>({ document, variables, operationName, headers, serverContext, }: GraphQLServerInject<TData, TVariables, TServerContext>): Promise<{
        response: Response;
        executionResult: ExecutionResult<TData> | null;
    }>;
    fetch: WindowOrWorkerGlobalScope['fetch'];
    private fetchEventListener;
    start(): void;
    stop(): void;
}
export declare type YogaServerInstance<TServerContext, TUserContext, TRootValue> = YogaServer<TServerContext, TUserContext, TRootValue> & (WindowOrWorkerGlobalScope['fetch'] | ((context: {
    request: Request;
}) => Promise<Response>));
export declare function createServer<TServerContext extends Record<string, any> = {}, TUserContext extends Record<string, any> = {}, TRootValue = {}>(options?: YogaServerOptions<TServerContext, TUserContext, TRootValue>): YogaServerInstance<TServerContext, TUserContext, TRootValue>;
export {};
