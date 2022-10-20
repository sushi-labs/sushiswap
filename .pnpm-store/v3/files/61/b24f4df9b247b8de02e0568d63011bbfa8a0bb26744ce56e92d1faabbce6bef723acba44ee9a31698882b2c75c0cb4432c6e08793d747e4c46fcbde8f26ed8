import { providers } from 'ethers';
import { Chain, ChainProviderFn, FallbackProviderConfig } from '../types';
export declare type JsonRpcProviderConfig = FallbackProviderConfig & {
    rpc: (chain: Chain) => {
        http: string;
        webSocket?: string;
    } | null;
    static?: boolean;
};
export declare function jsonRpcProvider({ priority, rpc, stallTimeout, static: static_, weight, }: JsonRpcProviderConfig): ChainProviderFn<providers.JsonRpcProvider, providers.WebSocketProvider>;
