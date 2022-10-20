import { Deployment, DeploymentsExtension, DeploymentSubmission } from '../types';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { HardhatRuntimeEnvironment, Network } from 'hardhat/types';
export declare class DeploymentsManager {
    deploymentsExtension: DeploymentsExtension;
    private db;
    private env;
    private deploymentsPath;
    impersonateUnknownAccounts: boolean;
    impersonatedAccounts: string[];
    addressesToProtocol: {
        [address: string]: string;
    };
    private network;
    private partialExtension;
    private utils;
    constructor(env: HardhatRuntimeEnvironment, network: Network);
    private networkWasSetup;
    setupNetwork(): void;
    private _chainId;
    getChainId(): Promise<string>;
    runAsNode(enabled: boolean): void;
    dealWithPendingTransactions(): Promise<void>;
    onPendingTx(tx: TransactionResponse, name?: string, deployment?: any): Promise<TransactionResponse>;
    getNamedAccounts(): Promise<{
        [name: string]: string;
    }>;
    getUnnamedAccounts(): Promise<string[]>;
    private getDeterminisityDeploymentInfo;
    getDeterministicDeploymentFactoryAddress(): Promise<string>;
    getDeterministicDeploymentFactoryDeployer(): Promise<string>;
    getDeterministicDeploymentFactoryFunding(): Promise<BigNumber>;
    getDeterministicDeploymentFactoryDeploymentTx(): Promise<string>;
    loadDeployments(chainIdExpected?: boolean): Promise<{
        [name: string]: Deployment;
    }>;
    deletePreviousDeployments(folderPath?: string): Promise<void>;
    getSolcInputPath(): string;
    deleteDotFile(name: string): Promise<void>;
    readDotFile(name: string): Promise<string>;
    saveDotFile(name: string, content: string): Promise<void>;
    deleteDeployment(name: string): Promise<void>;
    saveDeployment(name: string, deployment: DeploymentSubmission): Promise<boolean>;
    private companionManagers;
    addCompanionManager(name: string, networkDeploymentsManager: DeploymentsManager): void;
    runDeploy(tags?: string | string[], options?: {
        deletePreviousDeployments: boolean;
        log: boolean;
        resetMemory: boolean;
        writeDeploymentsToFiles: boolean;
        savePendingTx: boolean;
        export?: string;
        exportAll?: string;
        gasPrice?: string;
        maxFeePerGas?: string;
        maxPriorityFeePerGas?: string;
    }): Promise<{
        [name: string]: Deployment;
    }>;
    executeDeployScripts(deployScriptsPaths: string[], tags?: string[]): Promise<void>;
    export(options: {
        exportAll?: string;
        export?: string;
    }): Promise<void>;
    private _writeExports;
    private getImportPaths;
    private setup;
    private saveSnapshot;
    private revertSnapshot;
    disableAutomaticImpersonation(): void;
    private getNetworkName;
    private getDeploymentNetworkName;
    private deploymentFolder;
    private impersonateAccounts;
    setupAccounts(): Promise<{
        namedAccounts: {
            [name: string]: string;
        };
        unnamedAccounts: string[];
    }>;
}
//# sourceMappingURL=DeploymentsManager.d.ts.map