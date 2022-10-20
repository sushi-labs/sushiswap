import type * as ethers from "ethers";
import type { SignerWithAddress } from "../signers";
export interface Libraries {
    [libraryName: string]: string;
}
export interface FactoryOptions {
    signer?: ethers.Signer;
    libraries?: Libraries;
}
export declare function getContractFactory<T extends ethers.ContractFactory>(name: string, signerOrOptions?: ethers.Signer | string | FactoryOptions): Promise<T>;
export declare function getContractFactory<T extends ethers.ContractFactory>(abi: any[], bytecode: ethers.utils.BytesLike, signer?: ethers.Signer | string): Promise<T>;
export interface HardhatEthersHelpers {
    provider: ethers.providers.JsonRpcProvider;
    getContractFactory: typeof getContractFactory;
    getContractAt: <T extends ethers.Contract>(nameOrAbi: string | any[], address: string, signer?: ethers.Signer | string) => Promise<T>;
    getSigners: () => Promise<SignerWithAddress[]>;
    getSigner: (address: string) => Promise<SignerWithAddress>;
    getSignerOrNull: (address: string) => Promise<SignerWithAddress | null>;
    getNamedSigners: () => Promise<Record<string, SignerWithAddress>>;
    getNamedSigner: (name: string) => Promise<SignerWithAddress>;
    getNamedSignerOrNull: (name: string) => Promise<SignerWithAddress | null>;
    getUnnamedSigners: () => Promise<SignerWithAddress[]>;
    getContract: <T extends ethers.Contract>(name: string, signer?: ethers.Signer | string) => Promise<T>;
    getContractOrNull: <T extends ethers.Contract>(name: string, signer?: ethers.Signer | string) => Promise<T | null>;
}
//# sourceMappingURL=index.d.ts.map