import type { UniswapInterfaceMulticall } from './abi/types';
import type { MulticallContext } from './context';
import type { MulticallState, ListenerOptions } from './types';
/**
 * From the current all listeners state, return each call key mapped to the
 * minimum number of blocks per fetch. This is how often each key must be fetched.
 * @param allListeners the all listeners state
 * @param chainId the current chain id
 */
export declare function activeListeningKeys(allListeners: MulticallState['callListeners'], chainId?: number): {
    [callKey: string]: number;
};
/**
 * Return the keys that need to be refetched
 * @param callResults current call result state
 * @param listeningKeys each call key mapped to how old the data can be in blocks
 * @param chainId the current chain id
 * @param latestBlockNumber the latest block number
 */
export declare function outdatedListeningKeys(callResults: MulticallState['callResults'], listeningKeys: {
    [callKey: string]: number;
}, chainId: number | undefined, latestBlockNumber: number | undefined): string[];
export interface UpdaterProps {
    context: MulticallContext;
    chainId: number | undefined;
    latestBlockNumber: number | undefined;
    contract: UniswapInterfaceMulticall;
    isDebug?: boolean;
    listenerOptions?: ListenerOptions;
}
export declare function createUpdater(context: MulticallContext): (props: Omit<UpdaterProps, 'context'>) => JSX.Element;
