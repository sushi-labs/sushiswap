import { QueryClient } from '@tanstack/react-query';
import { Provider, WebSocketProvider } from '@wagmi/core';
import * as React from 'react';
import { Client } from './client';
export declare const Context: React.Context<Client<Provider, WebSocketProvider> | undefined>;
export declare const queryClientContext: React.Context<QueryClient | undefined>;
export declare type WagmiConfigProps<TProvider extends Provider = Provider, TWebSocketProvider extends WebSocketProvider = WebSocketProvider> = {
    /** React-decorated Client instance */
    client: Client<TProvider, TWebSocketProvider>;
};
export declare function WagmiConfig<TProvider extends Provider, TWebSocketProvider extends WebSocketProvider>({ children, client, }: React.PropsWithChildren<WagmiConfigProps<TProvider, TWebSocketProvider>>): JSX.Element;
export declare function useClient<TProvider extends Provider, TWebSocketProvider extends WebSocketProvider = WebSocketProvider>(): Client<TProvider, TWebSocketProvider>;
