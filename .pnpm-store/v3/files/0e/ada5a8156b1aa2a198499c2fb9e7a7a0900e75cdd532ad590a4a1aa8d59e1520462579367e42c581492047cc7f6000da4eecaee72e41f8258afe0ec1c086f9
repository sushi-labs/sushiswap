import { FetchSignerResult, Signer } from '@wagmi/core';
import { QueryConfig } from '../../types';
export declare type UseSignerConfig = Omit<QueryConfig<FetchSignerResult, Error>, 'cacheTime' | 'staleTime' | 'enabled'>;
export declare const queryKey: () => readonly [{
    readonly entity: "signer";
}];
export declare function useSigner<TSigner extends Signer>({ suspense, onError, onSettled, onSuccess, }?: UseSignerConfig): Pick<import("@tanstack/react-query").QueryObserverResult<FetchSignerResult<TSigner>, Error>, "error" | "data" | "fetchStatus" | "isError" | "isFetched" | "isFetching" | "isLoading" | "isRefetching" | "isSuccess" | "refetch"> & {
    isIdle: boolean;
    status: "error" | "success" | "idle" | "loading";
    internal: Pick<import("@tanstack/react-query").QueryObserverResult<unknown, unknown>, "dataUpdatedAt" | "errorUpdatedAt" | "failureCount" | "isFetchedAfterMount" | "isLoadingError" | "isPaused" | "isPlaceholderData" | "isPreviousData" | "isRefetchError" | "isStale" | "remove">;
};
