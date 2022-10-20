import { OAuthApp } from "../../index";
import { HandlerOptions } from "../types";
export declare function createWebWorkerHandler<T>(app: OAuthApp<T>, { pathPrefix, onUnhandledRequest, }?: HandlerOptions & {
    onUnhandledRequest?: (request: Request) => Response | Promise<Response>;
}): (request: Request) => Promise<Response>;
/** @deprecated */
export declare function createCloudflareHandler<T>(...args: Parameters<typeof createWebWorkerHandler>): (request: Request) => Promise<Response>;
