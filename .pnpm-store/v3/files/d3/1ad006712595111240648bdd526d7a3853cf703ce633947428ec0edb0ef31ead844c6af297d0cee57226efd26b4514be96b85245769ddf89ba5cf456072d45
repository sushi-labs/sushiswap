declare type IncomingMessage = any;
declare type ServerResponse = any;
import { OAuthApp } from "../../index";
import { HandlerOptions } from "../types";
import { ClientType, Options } from "../../types";
export declare function createNodeMiddleware(app: OAuthApp<Options<ClientType>>, { pathPrefix, onUnhandledRequest, }?: HandlerOptions & {
    onUnhandledRequest?: (request: IncomingMessage, response: ServerResponse) => void;
}): (request: IncomingMessage, response: ServerResponse, next?: Function | undefined) => Promise<void>;
export {};
