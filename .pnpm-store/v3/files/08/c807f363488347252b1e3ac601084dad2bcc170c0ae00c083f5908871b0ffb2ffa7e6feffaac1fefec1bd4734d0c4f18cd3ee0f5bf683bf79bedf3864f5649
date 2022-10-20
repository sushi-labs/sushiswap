import { Chain } from '../../types';
import { GetNetworkResult } from './getNetwork';
export declare type WatchNetworkCallback = (data: GetNetworkResult) => void;
export declare type WatchNetworkConfig = {
    selector?({ chainId, chains }: {
        chainId?: number;
        chains?: Chain[];
    }): any;
};
export declare function watchNetwork(callback: WatchNetworkCallback, { selector }?: WatchNetworkConfig): () => void;
