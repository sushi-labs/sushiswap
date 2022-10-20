import { Contract, ContractInterface, Signer, providers } from 'ethers';
export declare type GetContractArgs = {
    /** Contract address or ENS name */
    addressOrName: string;
    /** Contract interface or ABI */
    contractInterface: ContractInterface;
    /** Signer or provider to attach to contract */
    signerOrProvider?: Signer | providers.Provider | null;
};
export declare function getContract<T = Contract>({ addressOrName, contractInterface, signerOrProvider, }: GetContractArgs): T;
