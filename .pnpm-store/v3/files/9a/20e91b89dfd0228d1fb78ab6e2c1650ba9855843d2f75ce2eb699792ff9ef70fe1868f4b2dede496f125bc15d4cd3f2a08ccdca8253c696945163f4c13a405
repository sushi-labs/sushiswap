import { Chain, Ethereum } from '../types';
import { InjectedConnector, InjectedConnectorOptions } from './injected';
export declare type MetaMaskConnectorOptions = Pick<InjectedConnectorOptions, 'shimChainChangedDisconnect' | 'shimDisconnect'> & {
    /**
     * While "disconnected" with `shimDisconnect`, allows user to select a different MetaMask account (than the currently connected account) when trying to connect.
     */
    UNSTABLE_shimOnConnectSelectAccount?: boolean;
};
export declare class MetaMaskConnector extends InjectedConnector {
    #private;
    readonly id = "metaMask";
    readonly ready: boolean;
    constructor({ chains, options: options_, }?: {
        chains?: Chain[];
        options?: MetaMaskConnectorOptions;
    });
    connect({ chainId }?: {
        chainId?: number;
    }): Promise<{
        account: string;
        chain: {
            id: number;
            unsupported: boolean;
        };
        provider: Ethereum;
    }>;
    getProvider(): Promise<Ethereum | undefined>;
}
