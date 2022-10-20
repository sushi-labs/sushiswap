import { SendTransactionArgs, SendTransactionPreparedRequest, SendTransactionResult, SendTransactionUnpreparedRequest } from '@wagmi/core';
import { MutationConfig } from '../../types';
export declare type UseSendTransactionArgs = Omit<SendTransactionArgs, 'request' | 'type'> & ({
    /**
     * `recklesslyUnprepared`: Allow to pass through an unprepared `request`. Note: This has
     * [UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks), it
     * is highly recommended to not use this and instead prepare the request upfront
     * using the `usePrepareSendTransaction` hook.
     *
     * `prepared`: The request has been prepared with parameters required for sending a transaction
     * via the [`usePrepareSendTransaction` hook](https://wagmi.sh/docs/prepare-hooks/usePrepareSendTransaction)
     * */
    mode: 'prepared';
    /** The prepared request to send the transaction. */
    request: SendTransactionPreparedRequest['request'] | undefined;
} | {
    mode: 'recklesslyUnprepared';
    /** The unprepared request to send the transaction. */
    request?: SendTransactionUnpreparedRequest['request'];
});
export declare type UseSendTransactionMutationArgs = {
    /**
     * Recklessly pass through an unprepared `request`. Note: This has
     * [UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks), it is
     * highly recommended to not use this and instead prepare the request upfront
     * using the `usePrepareSendTransaction` hook.
     */
    recklesslySetUnpreparedRequest: SendTransactionUnpreparedRequest['request'];
};
export declare type UseSendTransactionConfig = MutationConfig<SendTransactionResult, Error, SendTransactionArgs>;
declare type SendTransactionFn = (overrideConfig?: UseSendTransactionMutationArgs) => void;
declare type SendTransactionAsyncFn = (overrideConfig?: UseSendTransactionMutationArgs) => Promise<SendTransactionResult>;
declare type MutateFnReturnValue<Args, Fn> = Args extends {
    mode: 'recklesslyUnprepared';
} ? Fn : Fn | undefined;
export declare const mutationKey: (args: UseSendTransactionArgs) => readonly [{
    readonly chainId?: number | undefined;
    readonly mode: 'prepared';
    readonly request: SendTransactionPreparedRequest['request'] | undefined;
    readonly entity: "sendTransaction";
} | {
    readonly chainId?: number | undefined;
    readonly mode: 'recklesslyUnprepared';
    readonly request?: import("@ethersproject/providers").TransactionRequest | undefined;
    readonly entity: "sendTransaction";
}];
/**
 * @description Hook for sending a transaction.
 *
 * It is recommended to pair this with the [`usePrepareSendTransaction` hook](/docs/prepare-hooks/usePrepareSendTransaction)
 * to [avoid UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks).
 *
 * @example
 * import { useSendTransaction, usePrepareSendTransaction } from 'wagmi'
 *
 * const config = usePrepareSendTransaction({
 *   request: {
 *     to: 'moxey.eth',
 *     value: parseEther('1'),
 *   }
 * })
 * const result = useSendTransaction(config)
 */
export declare function useSendTransaction<Args extends UseSendTransactionArgs = UseSendTransactionArgs>({ chainId, mode, request, onError, onMutate, onSettled, onSuccess, }: Args & UseSendTransactionConfig): {
    data: SendTransactionResult | undefined;
    error: Error | null;
    isError: boolean;
    isIdle: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    reset: () => void;
    sendTransaction: MutateFnReturnValue<Args, SendTransactionFn>;
    sendTransactionAsync: MutateFnReturnValue<Args, SendTransactionAsyncFn>;
    status: "error" | "success" | "idle" | "loading";
    variables: SendTransactionArgs | undefined;
};
export {};
