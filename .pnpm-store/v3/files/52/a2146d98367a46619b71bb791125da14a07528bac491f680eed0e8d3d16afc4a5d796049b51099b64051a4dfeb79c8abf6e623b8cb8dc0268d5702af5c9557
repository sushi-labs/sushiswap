import type WalletConnectProvider from '@walletconnect/ethereum-provider';
import { providers } from 'ethers';
import { Chain } from '../types';
import { Connector } from './base';
declare type WalletConnectOptions = ConstructorParameters<typeof WalletConnectProvider>[0];
declare type WalletConnectSigner = providers.JsonRpcSigner;
export declare class WalletConnectConnector extends Connector<WalletConnectProvider, WalletConnectOptions, WalletConnectSigner> {
    #private;
    readonly id = "walletConnect";
    readonly name = "WalletConnect";
    readonly ready = true;
    constructor(config: {
        chains?: Chain[];
        options: WalletConnectOptions;
    });
    connect({ chainId }?: {
        chainId?: number;
    }): Promise<{
        account: string;
        chain: {
            id: number;
            unsupported: boolean;
        };
        provider: providers.Web3Provider;
    }>;
    disconnect(): Promise<void>;
    getAccount(): Promise<string>;
    getChainId(): Promise<number>;
    getProvider({ chainId, create, }?: {
        chainId?: number;
        create?: boolean;
    }): Promise<WalletConnectProvider>;
    getSigner({ chainId }?: {
        chainId?: number;
    }): Promise<providers.JsonRpcSigner>;
    isAuthorized(): Promise<boolean>;
    protected onAccountsChanged: (accounts: string[]) => void;
    protected onChainChanged: (chainId: number | string) => void;
    protected onDisconnect: () => void;
}
export {};
