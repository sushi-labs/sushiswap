import { providers } from 'ethers';
import { ChainProviderFn, FallbackProviderConfig } from '../types';
export declare type InfuraProviderConfig = FallbackProviderConfig & {
    apiKey?: string;
};
export declare function infuraProvider({ apiKey, priority, stallTimeout, weight, }?: InfuraProviderConfig): ChainProviderFn<providers.InfuraProvider, providers.InfuraWebSocketProvider>;
