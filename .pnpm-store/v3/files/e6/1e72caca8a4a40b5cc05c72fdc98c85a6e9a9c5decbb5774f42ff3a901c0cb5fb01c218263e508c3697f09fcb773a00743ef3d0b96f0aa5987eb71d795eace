import { HardhatConfig } from "hardhat/src/types/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ContractByName, Metadata, TenderlyContract, TenderlyContractConfig } from "../tenderly/types";
export declare const getCompilerDataFromContracts: (contracts: TenderlyContract[], flatContracts: ContractByName[], hhConfig: HardhatConfig) => TenderlyContractConfig | undefined;
export declare const getContracts: (hre: HardhatRuntimeEnvironment, flatContracts: ContractByName[]) => Promise<TenderlyContract[]>;
export declare const resolveDependencies: (dependencyData: any, sourcePath: string, metadata: Metadata, visited: Record<string, boolean>) => void;
export declare const compareConfigs: (originalConfig: TenderlyContractConfig, newConfig: TenderlyContractConfig) => boolean;
export declare const newCompilerConfig: (config: HardhatConfig, sourcePath?: string) => TenderlyContractConfig;
export declare const extractCompilerVersion: (config: HardhatConfig, sourcePath?: string) => string;
//# sourceMappingURL=util.d.ts.map