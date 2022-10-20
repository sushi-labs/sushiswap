import { CallOverrides, Contract, providers } from 'ethers';
import { GetContractArgs } from './getContract';
export declare type DeprecatedWriteContractConfig = GetContractArgs & {
    /**
     * Chain id to use for write
     * If signer is not active on this chain, it will attempt to programmatically switch
     */
    chainId?: number;
    /** Method to call on contract */
    functionName: string;
    /** Arguments to pass contract method */
    args?: any | any[];
    overrides?: CallOverrides;
};
export declare type DeprecatedWriteContractResult = providers.TransactionResponse;
export declare function deprecatedWriteContract<TContract extends Contract = Contract>({ addressOrName, args, chainId, contractInterface, functionName, overrides, signerOrProvider, }: DeprecatedWriteContractConfig): Promise<DeprecatedWriteContractResult>;
