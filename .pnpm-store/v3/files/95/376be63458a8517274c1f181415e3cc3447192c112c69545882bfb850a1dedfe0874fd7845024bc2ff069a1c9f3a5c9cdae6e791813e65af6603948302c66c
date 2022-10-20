import { FetchTransactionArgs, FetchTransactionResult } from '@wagmi/core';
import { QueryConfig } from '../../types';
declare type UseTransactionArgs = Partial<FetchTransactionArgs>;
export declare type UseTransactionConfig = QueryConfig<FetchTransactionResult, Error>;
/**
 * @description Fetches transaction for hash
 *
 * @example
 * import { useTransaction } from 'wagmi'
 *
 * const result = useTransaction({
 *  chainId: 1,
 *  hash: '0x...',
 * })
 */
export declare function useTransaction({ cacheTime, chainId: chainId_, enabled, hash, staleTime, suspense, onError, onSettled, onSuccess, }?: UseTransactionArgs & UseTransactionConfig): Pick<import("@tanstack/react-query").QueryObserverResult<import("@ethersproject/providers").TransactionResponse, Error>, "error" | "data" | "fetchStatus" | "isError" | "isFetched" | "isFetching" | "isLoading" | "isRefetching" | "isSuccess" | "refetch"> & {
    isIdle: boolean;
    status: "error" | "success" | "idle" | "loading";
    internal: Pick<import("@tanstack/react-query").QueryObserverResult<unknown, unknown>, "dataUpdatedAt" | "errorUpdatedAt" | "failureCount" | "isFetchedAfterMount" | "isLoadingError" | "isPaused" | "isPlaceholderData" | "isPreviousData" | "isRefetchError" | "isStale" | "remove">;
};
export {};
