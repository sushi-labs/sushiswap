import { CallOverrides, Contract, PopulatedTransaction } from 'ethers/lib/ethers';
import { Address, Signer } from '../../types';
import { GetContractArgs } from './getContract';
export declare type PrepareWriteContractConfig<TSigner extends Signer = Signer> = Omit<GetContractArgs, 'signerOrProvider'> & {
    /** Chain ID used to validate if the signer is connected to the target chain */
    chainId?: number;
    /** Method to call on contract */
    functionName: string;
    /** Arguments to pass contract method */
    args?: any | any[];
    overrides?: CallOverrides;
    signer?: TSigner | null;
};
export declare type PrepareWriteContractResult<TSigner extends Signer = Signer> = PrepareWriteContractConfig<TSigner> & {
    chainId?: number;
    request: PopulatedTransaction & {
        to: Address;
        gasLimit: NonNullable<PopulatedTransaction['gasLimit']>;
    };
    mode: 'prepared';
};
/**
 * @description Prepares the parameters required for a contract write transaction.
 *
 * Returns config to be passed through to `writeContract`.
 *
 * @example
 * import { prepareWriteContract, writeContract } from '@wagmi/core'
 *
 * const config = await prepareWriteContract({
 *  addressOrName: '0x...',
 *  contractInterface: wagmiAbi,
 *  functionName: 'mint',
 * })
 * const result = await writeContract(config)
 */
export declare function prepareWriteContract<TContract extends Contract = Contract, TSigner extends Signer = Signer>({ addressOrName, args, chainId, contractInterface: contractInterface_, functionName, overrides, signer: signer_, }: PrepareWriteContractConfig): Promise<PrepareWriteContractResult<TSigner>>;
