import { IConnector, IWCEthRpcConnectionOptions } from "@walletconnect/types";
import { IEthereumProvider, ProviderAccounts, RequestArguments } from "eip1193-provider";
declare class WalletConnectProvider implements IEthereumProvider {
    events: any;
    private rpc;
    private signer;
    private http;
    constructor(opts?: IWCEthRpcConnectionOptions);
    get connected(): boolean;
    get connector(): IConnector;
    get accounts(): string[];
    get chainId(): number;
    get rpcUrl(): string;
    request<T = unknown>(args: RequestArguments): Promise<T>;
    sendAsync(args: RequestArguments, callback: (error: Error | null, response: any) => void): void;
    enable(): Promise<ProviderAccounts>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    on(event: any, listener: any): void;
    once(event: string, listener: any): void;
    removeListener(event: string, listener: any): void;
    off(event: string, listener: any): void;
    get isWalletConnect(): boolean;
    private registerEventListeners;
    private setHttpProvider;
}
export default WalletConnectProvider;
//# sourceMappingURL=index.d.ts.map