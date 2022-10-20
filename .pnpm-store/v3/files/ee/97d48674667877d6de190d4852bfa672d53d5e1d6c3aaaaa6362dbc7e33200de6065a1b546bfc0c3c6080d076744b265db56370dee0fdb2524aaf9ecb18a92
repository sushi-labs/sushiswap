import { WriteContractArgs, WriteContractPreparedArgs, WriteContractResult } from '@wagmi/core';
import { MutationConfig } from '../../types';
export declare type UseContractWriteArgs = Omit<WriteContractArgs, 'request' | 'type'> & ({
    /**
     * `recklesslyUnprepared`: Allow to pass through unprepared config. Note: This has harmful
     * [UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks), it is highly recommended
     * to not use this and instead prepare the config upfront using the `usePrepareContractWrite` hook.
     *
     * `prepared`: The config has been prepared with parameters required for performing a contract write
     * via the [`usePrepareContractWrite` hook](https://wagmi.sh/docs/prepare-hooks/usePrepareContractWrite)
     * */
    mode: 'prepared';
    /** The prepared request to perform a contract write. */
    request: WriteContractPreparedArgs['request'] | undefined;
} | {
    mode: 'recklesslyUnprepared';
    request?: undefined;
});
export declare type UseContractWriteMutationArgs = {
    /**
     * Recklessly pass through unprepared config. Note: This has
     * [UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks),
     * it is highly recommended to not use this and instead prepare the config upfront
     * using the `usePrepareContractWrite` function.
     */
    recklesslySetUnpreparedArgs?: WriteContractArgs['args'];
    recklesslySetUnpreparedOverrides?: WriteContractArgs['overrides'];
};
export declare type UseContractWriteConfig = MutationConfig<WriteContractResult, Error, UseContractWriteArgs>;
declare type ContractWriteFn = (overrideConfig?: UseContractWriteMutationArgs) => void;
declare type ContractWriteAsyncFn = (overrideConfig?: UseContractWriteMutationArgs) => Promise<WriteContractResult>;
declare type MutateFnReturnValue<Args, Fn> = Args extends {
    mode: 'recklesslyUnprepared';
} ? Fn : Fn | undefined;
export declare const mutationKey: ([{ addressOrName, args, chainId, contractInterface, functionName, overrides, request, },]: [UseContractWriteArgs]) => readonly [{
    readonly entity: "writeContract";
    readonly addressOrName: string;
    readonly args: any;
    readonly chainId: number | undefined;
    readonly contractInterface: import("ethers").ContractInterface;
    readonly functionName: string;
    readonly overrides: import("ethers").CallOverrides | undefined;
    readonly request: (import("ethers").PopulatedTransaction & {
        to: `0x${string}`;
        gasLimit: import("ethers").BigNumber;
    }) | undefined;
}];
/**
 * @description Hook for calling an ethers Contract [write](https://docs.ethers.io/v5/api/contract/contract/#Contract--write)
 * method.
 *
 * It is highly recommended to pair this with the [`usePrepareContractWrite` hook](/docs/prepare-hooks/usePrepareContractWrite)
 * to [avoid UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks).
 *
 * @example
 * import { useContractWrite, usePrepareContractWrite } from 'wagmi'
 *
 * const { config } = usePrepareContractWrite({
 *  addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
 *  contractInterface: wagmigotchiABI,
 *  functionName: 'feed',
 * })
 * const { data, isLoading, isSuccess, write } = useContractWrite(config)
 *
 */
export declare function useContractWrite<Args extends UseContractWriteArgs = UseContractWriteArgs>({ addressOrName, args, chainId, contractInterface, functionName, mode, overrides, request, onError, onMutate, onSettled, onSuccess, }: Args & UseContractWriteConfig): {
    data: import("@wagmi/core").SendTransactionResult | undefined;
    error: Error | null;
    isError: boolean;
    isIdle: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    reset: () => void;
    status: "error" | "success" | "idle" | "loading";
    variables: WriteContractArgs | undefined;
    write: MutateFnReturnValue<Args, ContractWriteFn>;
    writeAsync: MutateFnReturnValue<Args, ContractWriteAsyncFn>;
};
export {};
