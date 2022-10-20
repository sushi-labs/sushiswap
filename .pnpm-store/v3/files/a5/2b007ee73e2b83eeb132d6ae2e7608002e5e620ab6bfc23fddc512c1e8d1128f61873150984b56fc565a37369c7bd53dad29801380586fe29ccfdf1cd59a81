import { ReadContractConfig, ReadContractResult } from '@wagmi/core';
import { QueryConfig } from '../../types';
declare type UseContractReadArgs = ReadContractConfig & {
    /** If set to `true`, the cache will depend on the block number */
    cacheOnBlock?: boolean;
    /** Subscribe to changes */
    watch?: boolean;
};
export declare type UseContractReadConfig = QueryConfig<ReadContractResult, Error>;
export declare const queryKey: ([{ addressOrName, args, chainId, functionName, overrides }, { blockNumber },]: [Omit<ReadContractConfig, "contractInterface">, {
    blockNumber?: number | undefined;
}]) => readonly [{
    readonly entity: "readContract";
    readonly addressOrName: string;
    readonly args: any;
    readonly blockNumber: number | undefined;
    readonly chainId: number | undefined;
    readonly functionName: string;
    readonly overrides: import("ethers").CallOverrides | undefined;
}];
export declare function useContractRead({ addressOrName, contractInterface, functionName, args, chainId: chainId_, overrides, cacheOnBlock, cacheTime, enabled: enabled_, isDataEqual, select, staleTime, suspense, watch, onError, onSettled, onSuccess, }: UseContractReadArgs & UseContractReadConfig): Pick<import("@tanstack/react-query").QueryObserverResult<import("ethers/lib/utils").Result, Error>, "error" | "data" | "fetchStatus" | "isError" | "isFetched" | "isFetching" | "isLoading" | "isRefetching" | "isSuccess" | "refetch"> & {
    isIdle: boolean;
    status: "error" | "success" | "idle" | "loading";
    internal: Pick<import("@tanstack/react-query").QueryObserverResult<unknown, unknown>, "dataUpdatedAt" | "errorUpdatedAt" | "failureCount" | "isFetchedAfterMount" | "isLoadingError" | "isPaused" | "isPlaceholderData" | "isPreviousData" | "isRefetchError" | "isStale" | "remove">;
};
export {};
