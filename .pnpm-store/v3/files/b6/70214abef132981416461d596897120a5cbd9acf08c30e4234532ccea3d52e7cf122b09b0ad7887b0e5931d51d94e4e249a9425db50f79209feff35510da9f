import { providers } from 'ethers';
import { default as EventEmitter } from 'eventemitter3';
import { Signer } from '../../types';
export declare type MockProviderOptions = {
    chainId?: number;
    flags?: {
        isAuthorized?: boolean;
        failConnect?: boolean;
        failSwitchChain?: boolean;
        noSwitchChain?: boolean;
    };
    signer: Signer;
};
declare type Events = {
    accountsChanged(accounts: string[]): void;
    chainChanged(chainId: number | string): void;
    disconnect(): void;
};
declare type Event = keyof Events;
export declare class MockProvider extends providers.BaseProvider {
    #private;
    events: EventEmitter<Events, any>;
    constructor(options: MockProviderOptions);
    enable(): Promise<string[]>;
    disconnect(): Promise<void>;
    getAccounts(): Promise<string[]>;
    getSigner(): import("ethers").Signer;
    switchChain(chainId: number): Promise<void>;
    watchAsset(_asset: {
        address: string;
        decimals?: number;
        image?: string;
        symbol: string;
    }): Promise<boolean>;
    on(event: Event, listener: providers.Listener): this;
    once(event: Event, listener: providers.Listener): this;
    removeListener(event: Event, listener: providers.Listener): this;
    off(event: Event, listener: providers.Listener): this;
    toJSON(): string;
}
export {};
