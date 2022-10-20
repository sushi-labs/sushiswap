/// <reference types="node" />
import { EventEmitter } from "events";
import { IJsonRpcConnection, JsonRpcPayload } from "@json-rpc-tools/utils";
export declare class HttpConnection implements IJsonRpcConnection {
    url: string;
    events: EventEmitter;
    private api;
    private registering;
    constructor(url: string);
    get connected(): boolean;
    get connecting(): boolean;
    on(event: string, listener: any): void;
    once(event: string, listener: any): void;
    off(event: string, listener: any): void;
    removeListener(event: string, listener: any): void;
    open(url?: string): Promise<void>;
    close(): Promise<void>;
    send(payload: JsonRpcPayload, context?: any): Promise<void>;
    private register;
    private onOpen;
    private onClose;
    private onPayload;
    private onError;
}
//# sourceMappingURL=http.d.ts.map