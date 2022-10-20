import { providers } from 'ethers';
import { ChainProviderFn, FallbackProviderConfig } from '../types';
export declare type AlchemyProviderConfig = FallbackProviderConfig & {
    apiKey?: string;
};
export declare function alchemyProvider({ apiKey, priority, stallTimeout, weight, }?: AlchemyProviderConfig): ChainProviderFn<providers.AlchemyProvider, providers.AlchemyWebSocketProvider>;
