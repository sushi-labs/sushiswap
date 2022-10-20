import { QueryClient } from '@tanstack/react-query';
import { Persister } from '@tanstack/react-query-persist-client';
import { ClientConfig, Client as CoreClient, Provider, WebSocketProvider } from '@wagmi/core';
export declare type CreateClientConfig<TProvider extends Provider = Provider, TWebSocketProvider extends WebSocketProvider = WebSocketProvider> = ClientConfig<TProvider, TWebSocketProvider> & {
    queryClient?: QueryClient;
    persister?: Persister | null;
};
export declare function createClient<TProvider extends Provider, TWebSocketProvider extends WebSocketProvider>({ queryClient, persister, ...config }: CreateClientConfig<TProvider, TWebSocketProvider>): CoreClient<TProvider, TWebSocketProvider> & {
    queryClient: QueryClient;
};
export declare type Client<TProvider extends Provider = Provider, TWebSocketProvider extends WebSocketProvider = WebSocketProvider> = CoreClient<TProvider, TWebSocketProvider> & {
    queryClient: QueryClient;
};
