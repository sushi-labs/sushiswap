import { JsonRpcError, JsonRpcSchemaMap, JsonRpcRequest } from "./jsonrpc";
import { IBaseJsonRpcProvider, IJsonRpcProvider } from "./provider";
import { IJsonRpcRouter, JsonRpcRoutesConfig } from "./router";
import { IJsonRpcValidator } from "./validator";
export interface JsonRpcProvidersMap {
    [target: string]: IJsonRpcProvider;
}
export interface BaseMultiServiceProviderConfig {
    providers: JsonRpcProvidersMap;
    routes: JsonRpcRoutesConfig;
}
export interface MultiServiceProviderConfig extends BaseMultiServiceProviderConfig {
    schemas?: JsonRpcSchemaMap;
}
export declare abstract class IMultiServiceProvider extends IBaseJsonRpcProvider {
    config: MultiServiceProviderConfig;
    abstract providers: JsonRpcProvidersMap;
    abstract router: IJsonRpcRouter;
    abstract validator: IJsonRpcValidator | undefined;
    constructor(config: MultiServiceProviderConfig);
    abstract isSupported(method: string): boolean;
    abstract assertRequest(request: JsonRpcRequest): JsonRpcError | undefined;
    abstract getProvider(method: string): IJsonRpcProvider;
}
//# sourceMappingURL=multi.d.ts.map