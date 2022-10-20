import { ReadContractsConfig, ReadContractsResult } from './readContracts';
export declare type WatchReadContractsConfig = ReadContractsConfig & {
    listenToBlock?: boolean;
};
export declare type WatchReadContractsResult = (result: ReadContractsResult) => void;
export declare function watchReadContracts(config: WatchReadContractsConfig, callback: WatchReadContractsResult): () => void;
