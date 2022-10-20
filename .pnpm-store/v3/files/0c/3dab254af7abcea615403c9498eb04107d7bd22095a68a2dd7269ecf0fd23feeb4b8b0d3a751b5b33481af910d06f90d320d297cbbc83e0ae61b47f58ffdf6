import { DeprecatedSendTransactionArgs, DeprecatedSendTransactionResult } from '@wagmi/core';
import { MutationConfig } from '../../types';
export declare type UseDeprecatedSendTransactionArgs = Partial<DeprecatedSendTransactionArgs>;
export declare type UseDeprecatedSendTransactionConfig = MutationConfig<DeprecatedSendTransactionResult, Error, UseDeprecatedSendTransactionArgs>;
export declare const mutationKey: (args: UseDeprecatedSendTransactionArgs) => readonly [{
    readonly chainId?: number | undefined;
    readonly request?: import("@ethersproject/providers").TransactionRequest | undefined;
    readonly entity: "sendTransaction";
}];
/** @deprecated */
export declare function useDeprecatedSendTransaction({ chainId, request, onError, onMutate, onSettled, onSuccess, }?: UseDeprecatedSendTransactionArgs & UseDeprecatedSendTransactionConfig): {
    data: import("@ethersproject/providers").TransactionResponse | undefined;
    error: Error | null;
    isError: boolean;
    isIdle: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    reset: () => void;
    sendTransaction: (args?: DeprecatedSendTransactionArgs | undefined) => void;
    sendTransactionAsync: (args?: DeprecatedSendTransactionArgs | undefined) => Promise<import("@ethersproject/providers").TransactionResponse>;
    status: "error" | "success" | "idle" | "loading";
    variables: Partial<DeprecatedSendTransactionArgs> | undefined;
};
