import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider';
import { Opts as SafeOpts } from '@gnosis.pm/safe-apps-sdk';
import { Connector, Chain } from '@wagmi/core';
declare class SafeConnector extends Connector<SafeAppProvider, SafeOpts | undefined> {
    #private;
    readonly id = "safe";
    readonly name = "Safe";
    ready: boolean;
    constructor(config: {
        chains?: Chain[];
        options?: SafeOpts;
    });
    connect(): Promise<{
        account: string;
        provider: SafeAppProvider;
        chain: {
            id: number;
            unsupported: boolean;
        };
    }>;
    disconnect(): Promise<void>;
    getAccount(): Promise<string>;
    getChainId(): Promise<number>;
    getProvider(): Promise<SafeAppProvider>;
    getSigner(): Promise<import("@ethersproject/providers").JsonRpcSigner>;
    isAuthorized(): Promise<boolean>;
    protected onAccountsChanged(accounts: string[]): void;
    protected isChainUnsupported(chainId: number): boolean;
    protected onChainChanged(chainId: string | number): void;
    protected onDisconnect(): void;
}
export { SafeConnector };
