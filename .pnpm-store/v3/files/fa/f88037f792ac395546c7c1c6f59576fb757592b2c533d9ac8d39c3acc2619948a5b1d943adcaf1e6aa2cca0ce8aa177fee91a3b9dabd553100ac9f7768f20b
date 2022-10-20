/// <reference types="node" />
/// <reference lib="webworker" />
import type { RequestListener, ServerResponse } from 'node:http';
import { NodeRequest } from './utils';
export interface ServerAdapterBaseObject<TServerContext, THandleRequest extends ServerAdapterRequestHandler<TServerContext> = ServerAdapterRequestHandler<TServerContext>> {
    /**
     * An async function that takes `Request` and the server context and returns a `Response`.
     * If you use `requestListener`, the server context is `{ req: IncomingMessage, res: ServerResponse }`.
     */
    handle: THandleRequest;
}
export interface ServerAdapterObject<TServerContext, TBaseObject extends ServerAdapterBaseObject<TServerContext, ServerAdapterRequestHandler<TServerContext>>> extends EventListenerObject {
    /**
     * A basic request listener that takes a `Request` with the server context and returns a `Response`.
     */
    handleRequest: TBaseObject['handle'];
    /**
     * WHATWG Fetch spec compliant `fetch` function that can be used for testing purposes.
     */
    fetch(request: Request, ctx: TServerContext): Promise<Response> | Response;
    fetch(request: Request, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    fetch(urlStr: string, ctx: TServerContext): Promise<Response> | Response;
    fetch(urlStr: string, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    fetch(urlStr: string, init: RequestInit, ctx: TServerContext): Promise<Response> | Response;
    fetch(urlStr: string, init: RequestInit, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    fetch(url: URL, ctx: TServerContext): Promise<Response> | Response;
    fetch(url: URL, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    fetch(url: URL, init: RequestInit, ctx: TServerContext): Promise<Response> | Response;
    fetch(url: URL, init: RequestInit, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    /**
     * This function takes Node's request object and returns a WHATWG Fetch spec compliant `Response` object.
     **/
    handleNodeRequest(nodeRequest: NodeRequest, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    /**
     * A request listener function that can be used with any Node server variation.
     */
    requestListener: RequestListener;
    handle(req: NodeRequest, res: ServerResponse, ...ctx: Partial<TServerContext>[]): Promise<void>;
    handle(request: Request, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
    handle(fetchEvent: FetchEvent & Partial<TServerContext>, ...ctx: Partial<TServerContext>[]): void;
    handle(container: {
        request: Request;
    } & Partial<TServerContext>, ...ctx: Partial<TServerContext>[]): Promise<Response> | Response;
}
export declare type ServerAdapter<TServerContext, TBaseObject extends ServerAdapterBaseObject<TServerContext>> = TBaseObject & ServerAdapterObject<TServerContext, TBaseObject>['handle'] & ServerAdapterObject<TServerContext, TBaseObject>;
export declare type ServerAdapterRequestHandler<TServerContext> = (request: Request, ctx: TServerContext) => Promise<Response> | Response;
export declare type DefaultServerAdapterContext = {
    req: NodeRequest;
    res: ServerResponse;
    waitUntil(promise: Promise<unknown>): void;
};
declare function createServerAdapter<TServerContext = DefaultServerAdapterContext, THandleRequest extends ServerAdapterRequestHandler<TServerContext> = ServerAdapterRequestHandler<TServerContext>>(serverAdapterRequestHandler: THandleRequest, RequestCtor?: typeof Request): ServerAdapter<TServerContext, ServerAdapterBaseObject<TServerContext, THandleRequest>>;
declare function createServerAdapter<TServerContext, TBaseObject extends ServerAdapterBaseObject<TServerContext>>(serverAdapterBaseObject: TBaseObject, RequestCtor?: typeof Request): ServerAdapter<TServerContext, TBaseObject>;
export { createServerAdapter };
