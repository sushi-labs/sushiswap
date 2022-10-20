/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Socket } from 'node:net';
import type { Readable } from 'node:stream';
export interface NodeRequest {
    protocol?: string;
    hostname?: string;
    body?: any;
    url?: string;
    originalUrl?: string;
    method?: string;
    headers?: any;
    req?: IncomingMessage;
    raw?: IncomingMessage;
    socket?: Socket;
    query?: any;
}
export declare function normalizeNodeRequest(nodeRequest: NodeRequest, RequestCtor: typeof Request): Request;
export declare function isReadable(stream: any): stream is Readable;
export declare function isNodeRequest(request: any): request is NodeRequest;
export declare function isServerResponse(stream: any): stream is ServerResponse;
export declare function isReadableStream(stream: any): stream is ReadableStream;
export declare function isFetchEvent(event: any): event is FetchEvent;
export declare function sendNodeResponse({ headers, status, statusText, body }: Response, serverResponse: ServerResponse): Promise<void>;
export declare function isRequestInit(val: unknown): val is RequestInit;
