import * as path from 'path';
import { Artifact, HardhatRuntimeEnvironment, Network } from 'hardhat/types';
import { ExtendedArtifact, MultiExport } from '../types';
import { Transaction } from '@ethersproject/transactions';
export declare function getArtifactFromFolders(name: string, folderPaths: string[]): Promise<Artifact | ExtendedArtifact | undefined>;
export declare function getExtendedArtifactFromFolders(name: string, folderPaths: string[]): Promise<ExtendedArtifact | undefined>;
export declare function loadAllDeployments(hre: HardhatRuntimeEnvironment, deploymentsPath: string, onlyABIAndAddress?: boolean, externalDeployments?: {
    [networkName: string]: string[];
}): MultiExport;
export declare function deleteDeployments(deploymentsPath: string, subPath: string): void;
export declare function addDeployments(db: any, deploymentsPath: string, subPath: string, expectedChainId?: string, truffleChainId?: string): void;
export declare function processNamedAccounts(network: Network, namedAccounts: {
    [name: string]: string | number | {
        [network: string]: null | number | string;
    };
}, accounts: string[], chainIdGiven: string): {
    namedAccounts: {
        [name: string]: string;
    };
    unnamedAccounts: string[];
    unknownAccounts: string[];
    addressesToProtocol: {
        [address: string]: string;
    };
};
export declare function traverseMultipleDirectory(dirs: string[]): string[];
export declare const traverse: (dir: string, result?: any[], topDir?: string | undefined, filter?: ((name: string, stats: any) => boolean) | undefined) => Array<{
    name: string;
    path: string;
    relativePath: string;
    mtimeMs: number;
    directory: boolean;
}>;
export declare function getNetworkName(network: Network): string;
export declare function getDeployPaths(network: Network): string[];
export declare function mergeABIs(abis: any[][], options: {
    check: boolean;
    skipSupportsInterface: boolean;
}): any[];
export declare function recode(decoded: any): Transaction;
//# sourceMappingURL=utils.d.ts.map