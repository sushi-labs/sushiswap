import { FetchBlockNumberArgs, FetchBlockNumberResult } from '@wagmi/core';
import { QueryConfig } from '../../types';
declare type UseBlockNumberArgs = Partial<FetchBlockNumberArgs> & {
    /** Function fires when a new block is created */
    onBlock?: (blockNumber: number) => void;
    /** Subscribe to changes */
    watch?: boolean;
};
export declare type UseBlockNumberConfig = QueryConfig<FetchBlockNumberResult, Error>;
export declare const queryKey: ({ chainId }: {
    chainId?: number | undefined;
}) => readonly [{
    readonly entity: "blockNumber";
    readonly chainId: number | undefined;
}];
export declare function useBlockNumber({ cacheTime, chainId: chainId_, enabled, staleTime, suspense, watch, onBlock, onError, onSettled, onSuccess, }?: UseBlockNumberArgs & UseBlockNumberConfig): Pick<import("@tanstack/react-query").QueryObserverResult<number, Error>, "error" | "data" | "fetchStatus" | "isError" | "isFetched" | "isFetching" | "isLoading" | "isRefetching" | "isSuccess" | "refetch"> & {
    isIdle: boolean;
    status: "error" | "success" | "idle" | "loading";
    internal: Pick<import("@tanstack/react-query").QueryObserverResult<unknown, unknown>, "dataUpdatedAt" | "errorUpdatedAt" | "failureCount" | "isFetchedAfterMount" | "isLoadingError" | "isPaused" | "isPlaceholderData" | "isPreviousData" | "isRefetchError" | "isStale" | "remove">;
};
export {};
