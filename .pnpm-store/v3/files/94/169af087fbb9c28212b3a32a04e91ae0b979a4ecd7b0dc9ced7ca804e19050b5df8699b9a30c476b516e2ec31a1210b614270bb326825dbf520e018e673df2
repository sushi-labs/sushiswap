/// <reference types="node" />
import { EventEmitter } from "events";
import { RequestArguments, IJsonRpcProvider, IJsonRpcConnection, JsonRpcRequest, JsonRpcPayload } from "@json-rpc-tools/utils";
import { HttpConnection } from "./http";
import { WsConnection } from "./ws";
export declare class JsonRpcProvider extends IJsonRpcProvider {
    events: EventEmitter;
    connection: IJsonRpcConnection;
    constructor(connection: string | IJsonRpcConnection);
    connect(connection?: string | IJsonRpcConnection): Promise<void>;
    disconnect(): Promise<void>;
    on(event: string, listener: any): void;
    once(event: string, listener: any): void;
    off(event: string, listener: any): void;
    removeListener(event: string, listener: any): void;
    request<Result = any, Params = any>(request: RequestArguments<Params>, context?: any): Promise<Result>;
    protected requestStrict<Result = any, Params = any>(request: JsonRpcRequest<Params>, context?: any): Promise<Result>;
    protected setConnection(connection?: string | IJsonRpcConnection): HttpConnection | IJsonRpcConnection | WsConnection;
    protected onPayload(payload: JsonRpcPayload): void;
    protected open(connection?: string | IJsonRpcConnection): Promise<void>;
    protected close(): Promise<void>;
}
export default JsonRpcProvider;
//# sourceMappingURL=provider.d.ts.map