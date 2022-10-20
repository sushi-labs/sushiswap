import { providers } from 'ethers';
import { Chain } from '../types';
import { Connector } from './base';
export declare type InjectedConnectorOptions = {
    /** Name of connector */
    name?: string | ((detectedName: string | string[]) => string);
    /**
     * MetaMask 10.9.3 emits disconnect event when chain is changed.
     * This flag prevents the `"disconnect"` event from being emitted upon switching chains.
     * @see https://github.com/MetaMask/metamask-extension/issues/13375#issuecomment-1027663334
     */
    shimChainChangedDisconnect?: boolean;
    /**
     * MetaMask and other injected providers do not support programmatic disconnect.
     * This flag simulates the disconnect behavior by keeping track of connection status in storage.
     * @see https://github.com/MetaMask/metamask-extension/issues/10353
     * @default true
     */
    shimDisconnect?: boolean;
};
export declare class InjectedConnector extends Connector<Window['ethereum'], InjectedConnectorOptions | undefined, providers.JsonRpcSigner> {
    #private;
    readonly id: string;
    readonly name: string;
    readonly ready: boolean;
    protected shimDisconnectKey: string;
    constructor({ chains, options, }?: {
        chains?: Chain[];
        options?: InjectedConnectorOptions;
    });
    connect({ chainId }?: {
        chainId?: number;
    }): Promise<{
        account: string;
        chain: {
            id: number;
            unsupported: boolean;
        };
        provider: import("../types").Ethereum;
    }>;
    disconnect(): Promise<void>;
    getAccount(): Promise<string>;
    getChainId(): Promise<number>;
    getProvider(): Promise<import("../types").Ethereum | undefined>;
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
    protected isUserRejectedRequestError(error: unknown): boolean;
}
