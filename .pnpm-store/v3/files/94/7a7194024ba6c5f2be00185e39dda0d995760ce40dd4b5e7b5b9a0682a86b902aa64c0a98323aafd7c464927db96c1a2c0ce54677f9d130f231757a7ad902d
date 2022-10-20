import { PrepareSendTransactionArgs, PrepareSendTransactionResult } from '@wagmi/core';
import { QueryConfig } from '../../types';
export declare type UsePrepareSendTransactionArgs = Omit<PrepareSendTransactionArgs, 'request'> & {
    request: Partial<PrepareSendTransactionArgs['request']>;
};
export declare type UsePrepareSendTransactionConfig = QueryConfig<PrepareSendTransactionResult, Error>;
export declare const queryKey: ({ chainId, request, }: Omit<PrepareSendTransactionArgs, "request"> & {
    request: Partial<PrepareSendTransactionArgs['request']>;
} & {
    chainId?: number | undefined;
}) => readonly [{
    readonly entity: "prepareSendTransaction";
    readonly chainId: number | undefined;
    readonly request: Partial<import("@ethersproject/providers").TransactionRequest & {
        to: string;
    }>;
}];
/**
 * @description Hook for preparing a transaction to be sent via [`useSendTransaction`](/docs/hooks/useSendTransaction).
 *
 * Eagerly fetches the parameters required for sending a transaction such as the gas estimate and resolving an ENS address (if required).
 *
 * @example
 * import { useSendTransaction, usePrepareSendTransaction } from 'wagmi'
 *
 * const config = usePrepareSendTransaction({
 *   to: 'moxey.eth',
 *   value: parseEther('1'),
 * })
 * const result = useSendTransaction(config)
 */
export declare function usePrepareSendTransaction({ request, cacheTime, enabled, staleTime, // 24 hours
suspense, onError, onSettled, onSuccess, }: UsePrepareSendTransactionArgs & UsePrepareSendTransactionConfig): Pick<import("@tanstack/react-query").QueryObserverResult<PrepareSendTransactionResult, Error>, "error" | "data" | "fetchStatus" | "isError" | "isFetched" | "isFetching" | "isLoading" | "isRefetching" | "isSuccess" | "refetch"> & {
    isIdle: boolean;
    status: "error" | "success" | "idle" | "loading";
    internal: Pick<import("@tanstack/react-query").QueryObserverResult<unknown, unknown>, "dataUpdatedAt" | "errorUpdatedAt" | "failureCount" | "isFetchedAfterMount" | "isLoadingError" | "isPaused" | "isPlaceholderData" | "isPreviousData" | "isRefetchError" | "isStale" | "remove">;
} & {
    config: PrepareSendTransactionResult;
};
