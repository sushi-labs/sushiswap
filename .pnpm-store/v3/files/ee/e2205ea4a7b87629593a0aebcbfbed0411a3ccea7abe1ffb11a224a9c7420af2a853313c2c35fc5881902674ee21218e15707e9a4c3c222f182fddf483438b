import { DeprecatedWriteContractConfig, DeprecatedWriteContractResult } from '@wagmi/core';
import { MutationConfig } from '../../types';
export declare type UseDeprecatedContractWriteArgs = DeprecatedWriteContractConfig;
export declare type UseDeprecatedContractWriteMutationArgs = Pick<DeprecatedWriteContractConfig, 'args' | 'overrides'>;
export declare type UseDeprecatedContractWriteConfig = MutationConfig<DeprecatedWriteContractResult, Error, UseDeprecatedContractWriteArgs>;
export declare const mutationKey: ([{ addressOrName, args, chainId, contractInterface, overrides },]: [DeprecatedWriteContractConfig]) => readonly [{
    readonly entity: "writeContract";
    readonly addressOrName: string;
    readonly args: any;
    readonly chainId: number | undefined;
    readonly contractInterface: import("ethers").ContractInterface;
    readonly overrides: import("ethers").CallOverrides | undefined;
}];
/** @deprecated */
export declare function useDeprecatedContractWrite({ addressOrName, args, chainId, contractInterface, functionName, overrides, signerOrProvider, onError, onMutate, onSettled, onSuccess, }: UseDeprecatedContractWriteArgs & UseDeprecatedContractWriteConfig): {
    data: import("@ethersproject/providers").TransactionResponse | undefined;
    error: Error | null;
    isError: boolean;
    isIdle: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    reset: () => void;
    status: "error" | "success" | "idle" | "loading";
    variables: DeprecatedWriteContractConfig | undefined;
    write: (overrideConfig?: UseDeprecatedContractWriteMutationArgs | undefined) => void;
    writeAsync: (overrideConfig?: UseDeprecatedContractWriteMutationArgs | undefined) => Promise<import("@ethersproject/providers").TransactionResponse>;
};
