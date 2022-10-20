import { FactoryOptions, HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/src/types";
import { ethers } from "ethers";
import { Artifact } from "hardhat/types";
import { TenderlyPlugin } from "../type-extensions";
import { TenderlyConfig } from "./types";
export declare function wrapEthers(nativeEthers: typeof ethers & HardhatEthersHelpers, tenderly: TenderlyPlugin, tenderlyConfig: TenderlyConfig): typeof ethers & HardhatEthersHelpers;
export declare function getContractFactoryName(name: string, signerOrOptions?: ethers.Signer | FactoryOptions): Promise<ethers.ContractFactory>;
export declare function getContractFactoryABI(abi: any[], bytecode: ethers.utils.BytesLike, signer?: ethers.Signer): Promise<ethers.ContractFactory>;
export declare function getContractAt(nameOrAbi: string | any[], address: string, signer?: ethers.Signer): Promise<ethers.Contract>;
export declare function getContractFactoryFromArtifact(artifact: Artifact, signerOrOptions?: ethers.Signer | FactoryOptions): Promise<ethers.ContractFactory>;
export declare function getContractAtFromArtifact(artifact: Artifact, address: string, signer?: ethers.Signer): Promise<ethers.Contract>;
//# sourceMappingURL=ethers.d.ts.map