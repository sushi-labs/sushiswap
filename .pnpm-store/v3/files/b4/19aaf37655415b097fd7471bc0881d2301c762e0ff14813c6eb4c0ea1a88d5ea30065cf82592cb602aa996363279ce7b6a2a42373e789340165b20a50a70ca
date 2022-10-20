import { ReadContractConfig, ReadContractResult } from './readContract';
export declare type WatchReadContractConfig = ReadContractConfig & {
    listenToBlock?: boolean;
};
export declare type WatchReadContractResult = (result: ReadContractResult) => void;
export declare function watchReadContract(config: WatchReadContractConfig, callback: WatchReadContractResult): () => void;
