import { Callback } from "../types";
import { JSONRPCRequest, JSONRPCResponse } from "./JSONRPC";
export interface Web3Provider {
    send(request: JSONRPCRequest): JSONRPCResponse;
    send(request: JSONRPCRequest[]): JSONRPCResponse[];
    send(request: JSONRPCRequest, callback: Callback<JSONRPCResponse>): void;
    send(request: JSONRPCRequest[], callback: Callback<JSONRPCResponse[]>): void;
    send<T = any>(method: string, params?: any[] | any): Promise<T>;
    sendAsync(request: JSONRPCRequest, callback: Callback<JSONRPCResponse>): void;
    sendAsync(request: JSONRPCRequest[], callback: Callback<JSONRPCResponse[]>): void;
    request<T>(args: RequestArguments): Promise<T>;
    host: string;
    connected: boolean;
    chainId: string;
    supportsSubscriptions(): boolean;
    disconnect(): boolean;
}
export interface RequestArguments {
    /** The RPC method to request. */
    method: string;
    /** The params of the RPC method, if any. */
    params?: any;
}
