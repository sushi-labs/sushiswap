import { CallOverrides, Contract } from 'ethers/lib/ethers';
import { Result } from 'ethers/lib/utils';
import { GetContractArgs } from './getContract';
export declare type ReadContractConfig = {
    addressOrName: GetContractArgs['addressOrName'];
    /** Arguments to pass contract method */
    args?: any | any[];
    /** Chain id to use for provider */
    chainId?: number;
    contractInterface: GetContractArgs['contractInterface'];
    /** Function to invoke on the contract */
    functionName: string;
    /** Call overrides */
    overrides?: CallOverrides;
};
export declare type ReadContractResult<Data = Result> = Data;
export declare function readContract<TContract extends Contract = Contract, Data = Result>({ addressOrName, args, chainId, contractInterface, functionName, overrides, }: ReadContractConfig): Promise<ReadContractResult<Data>>;
