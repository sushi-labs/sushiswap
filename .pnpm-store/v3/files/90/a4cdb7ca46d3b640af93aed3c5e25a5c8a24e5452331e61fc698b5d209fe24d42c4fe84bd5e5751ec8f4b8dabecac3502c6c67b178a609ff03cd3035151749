import { CallOverrides } from 'ethers/lib/ethers';
import { Result } from 'ethers/lib/utils';
import { ReadContractConfig } from './readContract';
export declare type ReadContractsContract = {
    addressOrName: ReadContractConfig['addressOrName'];
    args?: ReadContractConfig['args'];
    chainId?: ReadContractConfig['chainId'];
    contractInterface: ReadContractConfig['contractInterface'];
    functionName: ReadContractConfig['functionName'];
};
export declare type ReadContractsConfig = {
    /** Failures will fail silently */
    allowFailure?: boolean;
    contracts: ReadContractsContract[];
    /** Call overrides */
    overrides?: CallOverrides;
};
export declare type ReadContractsResult<Data extends any[] = Result[]> = Data;
export declare function readContracts<Data extends any[] = Result[]>({ allowFailure, contracts, overrides, }: ReadContractsConfig): Promise<ReadContractsResult<Data>>;
