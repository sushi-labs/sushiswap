import { Mutate, StoreApi } from 'zustand/vanilla';
import { Connector, ConnectorData } from './connectors';
import { ClientStorage } from './storage';
import { Provider, WebSocketProvider } from './types';
export declare type ClientConfig<TProvider extends Provider = Provider, TWebSocketProvider extends WebSocketProvider = WebSocketProvider> = {
    /** Enables reconnecting to last used connector on init */
    autoConnect?: boolean;
    /**
     * Connectors used for linking accounts
     * @default [new InjectedConnector()]
     */
    connectors?: (() => Connector[]) | Connector[];
    /** Custom logger */
    logger?: {
        warn: typeof console.warn | null;
    };
    /** Interface for connecting to network */
    provider: ((config: {
        chainId?: number;
    }) => TProvider) | TProvider;
    /**
     * Custom storage for data persistance
     * @default window.localStorage
     */
    storage?: ClientStorage;
    /** WebSocket interface for connecting to network */
    webSocketProvider?: ((config: {
        chainId?: number;
    }) => TWebSocketProvider | undefined) | TWebSocketProvider;
};
export declare type Data<TProvider extends Provider> = ConnectorData<TProvider>;
export declare type State<TProvider extends Provider = Provider, TWebSocketProvider extends WebSocketProvider = WebSocketProvider> = {
    chains?: Connector['chains'];
    connector?: Connector;
    connectors: Connector[];
    data?: Data<TProvider>;
    error?: Error;
    provider: TProvider;
    status: 'connected' | 'connecting' | 'reconnecting' | 'disconnected';
    webSocketProvider?: TWebSocketProvider;
};
export declare class Client<TProvider extends Provider = Provider, TWebSocketProvider extends WebSocketProvider = WebSocketProvider> {
    #private;
    config: ClientConfig<TProvider, TWebSocketProvider>;
    providers: Map<number, TProvider | undefined>;
    storage: ClientStorage;
    store: Mutate<StoreApi<State<TProvider, TWebSocketProvider>>, [
        [
            'zustand/subscribeWithSelector',
            never
        ],
        [
            'zustand/persist',
            Partial<State<TProvider, TWebSocketProvider>>
        ]
    ]>;
    webSocketProviders: Map<number, TWebSocketProvider | undefined>;
    constructor({ autoConnect, connectors, provider, storage, logger, webSocketProvider, }: ClientConfig<TProvider, TWebSocketProvider>);
    get chains(): import("./types").Chain[] | undefined;
    get connectors(): Connector<any, any, any>[];
    get connector(): Connector<any, any, any> | undefined;
    get data(): Data<TProvider> | undefined;
    get error(): Error | undefined;
    get lastUsedChainId(): number | undefined;
    get provider(): TProvider;
    get status(): "connecting" | "connected" | "reconnecting" | "disconnected";
    get subscribe(): {
        (listener: (selectedState: State<TProvider, TWebSocketProvider>, previousSelectedState: State<TProvider, TWebSocketProvider>) => void): () => void;
        <U>(selector: (state: State<TProvider, TWebSocketProvider>) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
            equalityFn?: ((a: U, b: U) => boolean) | undefined;
            fireImmediately?: boolean | undefined;
        } | undefined): () => void;
    };
    get webSocketProvider(): TWebSocketProvider | undefined;
    setState(updater: State<TProvider, TWebSocketProvider> | ((state: State<TProvider, TWebSocketProvider>) => State<TProvider, TWebSocketProvider>)): void;
    clearState(): void;
    destroy(): Promise<void>;
    autoConnect(): Promise<Data<TProvider> | undefined>;
    getProvider({ bust, chainId }?: {
        bust?: boolean;
        chainId?: number;
    }): TProvider;
    getWebSocketProvider({ bust, chainId, }?: {
        bust?: boolean;
        chainId?: number;
    }): TWebSocketProvider | undefined;
    setLastUsedConnector(lastUsedConnector?: string | null): void;
}
export declare let client: Client<Provider, WebSocketProvider>;
export declare function createClient<TProvider extends Provider = Provider, TWebSocketProvider extends WebSocketProvider = WebSocketProvider>(config: ClientConfig<TProvider, TWebSocketProvider>): Client<TProvider, TWebSocketProvider>;
export declare function getClient<TProvider extends Provider = Provider, TWebSocketProvider extends WebSocketProvider = WebSocketProvider>(): Client<TProvider, TWebSocketProvider>;
