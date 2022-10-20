import { IKeyValueStorage } from "keyvaluestorage-interface";
import { JsonRpcError, JsonRpcRequest, JsonRpcResponse, JsonRpcSchemaMap } from "./jsonrpc";
import { IEvents } from "./misc";
import { IJsonRpcConnection, IJsonRpcProvider } from "./provider";
import { IJsonRpcRouter, JsonRpcRoutesConfig } from "./router";
import { IJsonRpcValidator } from "./validator";
export declare abstract class IPendingRequests {
    storage?: IKeyValueStorage | undefined;
    chainId: string | undefined;
    abstract pending: JsonRpcRequest[];
    constructor(storage?: IKeyValueStorage | undefined);
    abstract init(chainId?: string): Promise<void>;
    abstract set(request: JsonRpcRequest): Promise<void>;
    abstract get(id: number): Promise<JsonRpcRequest | undefined>;
    abstract delete(id: number): Promise<void>;
}
export interface BlockchainAuthenticatorConfig {
    provider: IBlockchainProvider;
    requiredApproval: string[];
    storage?: IKeyValueStorage;
}
export declare abstract class IBlockchainAuthenticator extends IEvents {
    config: BlockchainAuthenticatorConfig;
    abstract chainId: string;
    abstract pending: IPendingRequests;
    abstract provider: IBlockchainProvider;
    constructor(config: BlockchainAuthenticatorConfig);
    abstract init(): Promise<void>;
    abstract assert(request: JsonRpcRequest): Promise<boolean>;
    abstract approve(request: JsonRpcRequest): Promise<JsonRpcResponse>;
    abstract reject(request: JsonRpcRequest): Promise<JsonRpcError>;
    abstract resolve(request: JsonRpcRequest): Promise<JsonRpcResponse>;
}
export interface BaseBlockchainRoutes extends JsonRpcRoutesConfig {
    http: string[];
    signer: string[];
}
export interface BlockchainRoutesWithWebsockets extends BaseBlockchainRoutes {
    ws: string[];
}
export declare type BlockchainRoutes = BaseBlockchainRoutes | BlockchainRoutesWithWebsockets;
export interface BlockchainJsonRpcConfig {
    routes: BlockchainRoutes;
    schemas?: JsonRpcSchemaMap;
}
export interface BlockchainSubproviderConfig {
    connection: string | IJsonRpcConnection;
    routes: string[];
}
export interface BlockchainProviderConfig {
    chainId: string;
    routes: string[];
    signer?: BlockchainSubproviderConfig;
    subscriber?: BlockchainSubproviderConfig;
    validator?: IJsonRpcValidator;
}
export declare abstract class IBlockchainProvider extends IJsonRpcProvider {
    abstract chainId: string;
    abstract config: BlockchainProviderConfig;
    abstract router: IJsonRpcRouter;
    abstract signer: IJsonRpcProvider | undefined;
    abstract subscriber: IJsonRpcProvider | undefined;
    abstract validator: IJsonRpcValidator | undefined;
    constructor(connection: string | IJsonRpcConnection, config: BlockchainProviderConfig);
    abstract isSupported(method: string): boolean;
    abstract assertRequest(request: JsonRpcRequest): JsonRpcError | undefined;
}
//# sourceMappingURL=blockchain.d.ts.map