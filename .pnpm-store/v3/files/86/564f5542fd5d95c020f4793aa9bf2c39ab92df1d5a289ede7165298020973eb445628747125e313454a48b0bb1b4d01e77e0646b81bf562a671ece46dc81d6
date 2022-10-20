import { Chain } from '../../types';
import { Connector, ConnectorData } from '../base';
import { MockProvider, MockProviderOptions } from './provider';
export declare class MockConnector extends Connector<MockProvider, MockProviderOptions> {
    #private;
    readonly id = "mock";
    readonly name = "Mock";
    readonly ready = true;
    constructor(config: {
        chains?: Chain[];
        options: MockProviderOptions;
    });
    connect({ chainId }?: {
        chainId?: number;
    }): Promise<Required<ConnectorData<any>>>;
    disconnect(): Promise<void>;
    getAccount(): Promise<string>;
    getChainId(): Promise<number>;
    getProvider({ chainId }?: {
        chainId?: number;
    }): Promise<MockProvider>;
    getSigner(): Promise<import("ethers").Signer>;
    isAuthorized(): Promise<boolean>;
    watchAsset(asset: {
        address: string;
        decimals?: number;
        image?: string;
        symbol: string;
    }): Promise<boolean>;
    protected onAccountsChanged: (accounts: string[]) => void;
    protected onChainChanged: (chainId: number | string) => void;
    protected onDisconnect: () => void;
    toJSON(): string;
}
