/// <reference types="node" />
/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AddressInfo } from './types.js';
import type { Socket } from 'node:net';
export interface NodeRequest {
    protocol?: string;
    hostname?: string;
    body?: any;
    url?: string;
    method?: string;
    headers: any;
    req?: IncomingMessage;
    raw?: IncomingMessage;
    socket?: Socket;
    query?: any;
}
export declare function getNodeRequest(nodeRequest: NodeRequest, defaultAddressInfo: AddressInfo, RequestCtor: typeof Request): Request;
export declare function sendNodeResponse({ headers, status, statusText, body }: Response, serverResponse: ServerResponse): Promise<void>;
