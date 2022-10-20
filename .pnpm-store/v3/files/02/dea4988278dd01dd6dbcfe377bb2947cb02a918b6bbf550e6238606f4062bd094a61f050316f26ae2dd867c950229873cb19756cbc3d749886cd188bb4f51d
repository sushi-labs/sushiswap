import type { CoinbaseWalletProvider } from '@coinbase/wallet-sdk';
import type { CoinbaseWalletSDKOptions } from '@coinbase/wallet-sdk/dist/CoinbaseWalletSDK';
import { providers } from 'ethers';
import { Chain } from '../types';
import { Connector } from './base';
declare type Options = CoinbaseWalletSDKOptions & {
    /**
     * Fallback Ethereum JSON RPC URL
     * @default ""
     */
    jsonRpcUrl?: string;
    /**
     * Fallback Ethereum Chain ID
     * @default 1
     */
    chainId?: number;
};
export declare class CoinbaseWalletConnector extends Connector<CoinbaseWalletProvider, Options, providers.JsonRpcSigner> {
    #private;
    readonly id = "coinbaseWallet";
    readonly name = "Coinbase Wallet";
    readonly ready = true;
    constructor({ chains, options }: {
        chains?: Chain[];
        options: Options;
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
    getProvider(): Promise<CoinbaseWalletProvider>;
    getSigner(): Promise<providers.JsonRpcSigner>;
    isAuthorized(): Promise<boolean>;
    switchChain(chainId: number): Promise<Chain>;
    watchAsset({ address, decimals, image, symbol, }: {
        address: string;
        decimals?: number;
        image?: string;
        symbol: string;
    }): Promise<boolean>;
    protected onAccountsChanged: (accounts: string[]) => void;
    protected onChainChanged: (chainId: number | string) => void;
    protected onDisconnect: () => void;
}
export {};
