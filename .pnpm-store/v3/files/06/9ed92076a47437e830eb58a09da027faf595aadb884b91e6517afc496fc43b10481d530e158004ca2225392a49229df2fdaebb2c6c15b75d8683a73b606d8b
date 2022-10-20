declare type IncomingMessage = any;
declare type ServerResponse = any;
import { App } from "../../index";
import { Options } from "../../types";
export declare type MiddlewareOptions = {
    pathPrefix?: string;
    log?: Options["log"];
    onUnhandledRequest?: (request: IncomingMessage, response: ServerResponse) => void;
};
export declare function createNodeMiddleware(app: App, options?: MiddlewareOptions): (request: any, response: any, next?: Function | undefined) => Promise<any>;
export declare function middleware(options: Required<MiddlewareOptions>, { webhooksMiddleware, oauthMiddleware }: any, request: IncomingMessage, response: ServerResponse, next?: Function): Promise<any>;
export {};
