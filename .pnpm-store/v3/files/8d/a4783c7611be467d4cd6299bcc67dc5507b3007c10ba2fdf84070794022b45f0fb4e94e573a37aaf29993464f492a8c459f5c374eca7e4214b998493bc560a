import type { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import type { SignerWithAddress } from "../signers";
import type { FactoryOptions } from "../types";
export declare function getSignerOrNull(hre: HardhatRuntimeEnvironment, address: string): Promise<SignerWithAddress | null>;
export declare function getSigner(hre: HardhatRuntimeEnvironment, address: string): Promise<SignerWithAddress>;
export declare function getSigners(hre: HardhatRuntimeEnvironment): Promise<SignerWithAddress[]>;
export declare function getNamedSigners(hre: HardhatRuntimeEnvironment): Promise<Record<string, SignerWithAddress>>;
export declare function getUnnamedSigners(hre: HardhatRuntimeEnvironment): Promise<SignerWithAddress[]>;
export declare function getNamedSignerOrNull(hre: HardhatRuntimeEnvironment, name: string): Promise<SignerWithAddress | null>;
export declare function getNamedSigner(hre: HardhatRuntimeEnvironment, name: string): Promise<SignerWithAddress>;
export declare function getContractFactory<T extends ethers.ContractFactory>(hre: HardhatRuntimeEnvironment, name: string, signerOrOptions?: ethers.Signer | string | FactoryOptions): Promise<T>;
export declare function getContractFactory<T extends ethers.ContractFactory>(hre: HardhatRuntimeEnvironment, abi: any[], bytecode: ethers.utils.BytesLike, signer?: ethers.Signer | string): Promise<T>;
export declare function getContractAt<T extends ethers.Contract>(hre: HardhatRuntimeEnvironment, nameOrAbi: string | any[], address: string, signer?: ethers.Signer | string): Promise<T>;
export declare function getContract<T extends ethers.Contract>(env: HardhatRuntimeEnvironment, contractName: string, signer?: ethers.Signer | string): Promise<T>;
export declare function getContractOrNull<T extends ethers.Contract>(env: HardhatRuntimeEnvironment, contractName: string, signer?: ethers.Signer | string): Promise<T | null>;
//# sourceMappingURL=helpers.d.ts.map