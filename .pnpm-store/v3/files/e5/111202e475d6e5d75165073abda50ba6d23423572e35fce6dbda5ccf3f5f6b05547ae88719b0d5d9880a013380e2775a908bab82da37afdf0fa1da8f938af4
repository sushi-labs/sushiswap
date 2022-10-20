import { providers } from 'ethers';
import { Chain, ChainProviderFn, Provider, WebSocketProvider } from '../types';
export declare type ConfigureChainsConfig = {
    pollingInterval?: number;
    stallTimeout?: number;
} & ({
    targetQuorum?: number;
    minQuorum?: never;
} | {
    targetQuorum: number;
    minQuorum?: number;
});
export declare function configureChains<TProvider extends Provider = Provider, TWebSocketProvider extends WebSocketProvider = WebSocketProvider, TChain extends Chain = Chain>(defaultChains: TChain[], providers: ChainProviderFn<TProvider, TWebSocketProvider, TChain>[], { minQuorum, pollingInterval, targetQuorum, stallTimeout, }?: ConfigureChainsConfig): {
    readonly chains: TChain[];
    readonly provider: ({ chainId }: {
        chainId?: number | undefined;
    }) => (TProvider & {
        chains: TChain[];
    }) | (providers.FallbackProvider & {
        chains: TChain[];
        pollingInterval: number;
    });
    readonly webSocketProvider: ({ chainId }: {
        chainId?: number | undefined;
    }) => (TWebSocketProvider & {
        chains: TChain[];
    }) | undefined;
};
