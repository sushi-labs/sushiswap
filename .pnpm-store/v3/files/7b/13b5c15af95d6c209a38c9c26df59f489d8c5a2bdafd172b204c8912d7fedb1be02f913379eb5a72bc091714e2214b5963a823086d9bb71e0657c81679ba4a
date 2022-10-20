/// <reference types="node" />
import { IncomingMessage, Server as NodeServer, ServerResponse } from 'http';
import { NodeRequest } from './http-utils.js';
import { YogaServer } from '@graphql-yoga/common';
import type { YogaNodeServerOptions, AddressInfo } from './types.js';
declare class YogaNodeServer<TServerContext extends Record<string, any>, TUserContext extends Record<string, any>, TRootValue> extends YogaServer<TServerContext, TUserContext, TRootValue> {
    private options?;
    /**
     * Address Information for Server
     */
    private addressInfo;
    private nodeServer;
    constructor(options?: YogaNodeServerOptions<TServerContext, TUserContext, TRootValue> | undefined);
    getAddressInfo(): AddressInfo;
    getServerUrl(): string;
    handleIncomingMessage(nodeRequest: NodeRequest, serverContext: TServerContext): Promise<Response>;
    requestListener: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
    handle: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
    /**
     * @deprecated Will be removed in the next major. Get the server from `.start()` instead
     */
    getNodeServer(): NodeServer;
    private getOrCreateNodeServer;
    start(): Promise<NodeServer>;
    stop(): Promise<void>;
}
/**
 * Create a simple yet powerful GraphQL server ready for production workloads.
 * Spec compliant server that supports bleeding edge GraphQL features without any vendor lock-ins.
 *
 * Comes baked in with:
 *
 * - Envelop - Plugin system for GraphQL
 * - GraphiQL - GraphQL IDE for your browser
 *
 * Example:
 * ```ts
 *  import { schema } from './schema.js'
 *   // Provide a GraphQL schema
 *  const server = createServer({ schema })
 *  // Start the server. Defaults to http://localhost:4000/graphql
 *  server.start()
 * ```
 */
export declare function createServer<TServerContext extends Record<string, any> = {
    req: IncomingMessage;
    res: ServerResponse;
}, TUserContext extends Record<string, any> = {}, TRootValue = {}>(options?: YogaNodeServerOptions<TServerContext, TUserContext, TRootValue>): YogaNodeServerInstance<TServerContext, TUserContext, TRootValue>;
export declare type YogaNodeServerInstance<TServerContext, TUserContext, TRootValue> = YogaNodeServer<TServerContext, TUserContext, TRootValue> & YogaNodeServer<TServerContext, TUserContext, TRootValue>['requestListener'];
export * from './types.js';
export { ExecutionPatchResult, YogaInitialContext, CORSOptions, YogaLogger, GraphQLYogaError, shouldRenderGraphiQL, renderGraphiQL, GraphiQLOptions, } from '@graphql-yoga/common';
export * from '@envelop/core';
export * from '@graphql-yoga/subscription';
