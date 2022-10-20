import { ReadContractsConfig, ReadContractsResult } from '@wagmi/core';
import { QueryConfig } from '../../types';
export declare type UseContractReadsConfig = QueryConfig<ReadContractsResult, Error> & ReadContractsConfig & {
    /** If set to `true`, the cache will depend on the block number */
    cacheOnBlock?: boolean;
    /** Subscribe to changes */
    watch?: boolean;
};
export declare const queryKey: ([{ allowFailure, contracts, overrides }, { blockNumber, chainId },]: [ReadContractsConfig, {
    blockNumber?: number | undefined;
    chainId?: number | undefined;
}]) => readonly [{
    readonly entity: "readContracts";
    readonly allowFailure: boolean | undefined;
    readonly blockNumber: number | undefined;
    readonly chainId: number | undefined;
    readonly contracts: {
        addressOrName: string;
        args: any;
        chainId: number | undefined;
        functionName: string;
    }[];
    readonly overrides: import("ethers").CallOverrides | undefined;
}];
export declare function useContractReads({ allowFailure, cacheOnBlock, cacheTime, contracts, overrides, enabled: enabled_, isDataEqual, keepPreviousData, onError, onSettled, onSuccess, select, staleTime, suspense, watch, }: UseContractReadsConfig): Pick<import("@tanstack/react-query").QueryObserverResult<import("ethers/lib/utils").Result[], Error>, "error" | "data" | "fetchStatus" | "isError" | "isFetched" | "isFetching" | "isLoading" | "isRefetching" | "isSuccess" | "refetch"> & {
    isIdle: boolean;
    status: "error" | "success" | "idle" | "loading";
    internal: Pick<import("@tanstack/react-query").QueryObserverResult<unknown, unknown>, "dataUpdatedAt" | "errorUpdatedAt" | "failureCount" | "isFetchedAfterMount" | "isLoadingError" | "isPaused" | "isPlaceholderData" | "isPreviousData" | "isRefetchError" | "isStale" | "remove">;
};
