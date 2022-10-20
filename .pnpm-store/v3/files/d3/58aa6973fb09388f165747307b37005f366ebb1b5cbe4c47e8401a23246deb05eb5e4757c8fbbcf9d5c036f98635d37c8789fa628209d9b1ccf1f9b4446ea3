export interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}
export interface ProviderMessage {
    type: string;
    data: unknown;
}
export interface ProviderInfo {
    chainId: string;
}
export interface RequestArguments {
    method: string;
    params?: unknown[] | object;
}
export declare type ProviderChainId = string;
export declare type ProviderAccounts = string[];
export interface EIP1102Request extends RequestArguments {
    method: "eth_requestAccounts";
}
export interface SimpleEventEmitter {
    on(event: string, listener: any): void;
    once(event: string, listener: any): void;
    removeListener(event: string, listener: any): void;
    off(event: string, listener: any): void;
}
export interface EIP1193Provider extends SimpleEventEmitter {
    on(event: "connect", listener: (info: ProviderInfo) => void): void;
    on(event: "disconnect", listener: (error: ProviderRpcError) => void): void;
    on(event: "message", listener: (message: ProviderMessage) => void): void;
    on(event: "chainChanged", listener: (chainId: ProviderChainId) => void): void;
    on(event: "accountsChanged", listener: (accounts: ProviderAccounts) => void): void;
    request(args: RequestArguments): Promise<unknown>;
}
export interface IEthereumProvider extends EIP1193Provider {
    enable(): Promise<ProviderAccounts>;
}
//# sourceMappingURL=types.d.ts.map