import { CallOverrides } from 'ethers/lib/ethers';
import { Result } from 'ethers/lib/utils';
import { ReadContractConfig } from './readContract';
declare type MulticallContract = {
    addressOrName: ReadContractConfig['addressOrName'];
    args?: ReadContractConfig['args'];
    contractInterface: ReadContractConfig['contractInterface'];
    functionName: ReadContractConfig['functionName'];
};
export declare type MulticallConfig = {
    /** Failures in the multicall will fail silently */
    allowFailure?: boolean;
    /** Chain id to use for provider */
    chainId?: number;
    contracts: MulticallContract[];
    /** Call overrides */
    overrides?: CallOverrides;
};
export declare type MulticallResult<Data extends any[] = Result[]> = Data;
export declare function multicall<Data extends any[] = Result[]>({ allowFailure, chainId, contracts, overrides, }: MulticallConfig): Promise<MulticallResult<Data>>;
export {};
