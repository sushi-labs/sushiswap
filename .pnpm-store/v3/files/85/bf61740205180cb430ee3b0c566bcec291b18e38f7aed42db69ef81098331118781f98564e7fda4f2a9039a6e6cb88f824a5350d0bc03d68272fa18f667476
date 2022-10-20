import { JsonRpcPayload, JsonRpcRequest, RequestArguments } from "./jsonrpc";
import { IEvents } from "./misc";
export declare abstract class IJsonRpcConnection extends IEvents {
    abstract connected: boolean;
    abstract connecting: boolean;
    constructor(opts?: any);
    abstract open(opts?: any): Promise<void>;
    abstract close(): Promise<void>;
    abstract send(payload: JsonRpcPayload, context?: any): Promise<void>;
}
export declare abstract class IBaseJsonRpcProvider extends IEvents {
    constructor();
    abstract connect(params?: any): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract request<Result = any, Params = any>(request: RequestArguments<Params>, context?: any): Promise<Result>;
    protected abstract requestStrict<Result = any, Params = any>(request: JsonRpcRequest<Params>, context?: any): Promise<Result>;
}
export declare abstract class IJsonRpcProvider extends IBaseJsonRpcProvider {
    abstract connection: IJsonRpcConnection;
    constructor(connection: string | IJsonRpcConnection);
    abstract connect(connection?: string | IJsonRpcConnection): Promise<void>;
    protected abstract setConnection(connection?: string | IJsonRpcConnection): IJsonRpcConnection;
    protected abstract onPayload(payload: JsonRpcPayload): void;
    protected abstract open(connection?: string | IJsonRpcConnection): Promise<void>;
    protected abstract close(): Promise<void>;
}
//# sourceMappingURL=provider.d.ts.map