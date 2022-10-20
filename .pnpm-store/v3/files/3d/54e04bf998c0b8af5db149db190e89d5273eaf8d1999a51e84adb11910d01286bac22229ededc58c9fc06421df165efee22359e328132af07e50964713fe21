import 'hardhat/types/runtime';
import 'hardhat/types/config';
import { LinkReferences, Artifact, HardhatRuntimeEnvironment } from 'hardhat/types';
import type { BigNumber } from '@ethersproject/bignumber';
export declare type ExtendedArtifact = {
    abi: any[];
    bytecode: string;
    deployedBytecode?: string;
    metadata?: string;
    linkReferences?: LinkReferences;
    deployedLinkReferences?: LinkReferences;
    solcInput?: string;
    solcInputHash?: string;
    userdoc?: any;
    devdoc?: any;
    methodIdentifiers?: any;
    storageLayout?: any;
    evm?: any;
};
export interface DeployFunction {
    (env: HardhatRuntimeEnvironment): Promise<void | boolean>;
    skip?: (env: HardhatRuntimeEnvironment) => Promise<boolean>;
    tags?: string[];
    dependencies?: string[];
    runAtTheEnd?: boolean;
    id?: string;
}
export declare type Address = string;
export declare type ABI = any[];
export declare type Log = {
    blockNumber: number;
    blockHash: string;
    transactionHash: string;
    transactionIndex: number;
    logIndex: number;
    removed: boolean;
    address: string;
    topics: string[];
    data: string;
};
export declare type Receipt = {
    from: Address;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    transactionIndex: number;
    cumulativeGasUsed: BigNumber | string | number;
    gasUsed: BigNumber | string | number;
    contractAddress?: string;
    to?: Address;
    logs?: Log[];
    events?: any[];
    logsBloom?: string;
    byzantium?: boolean;
    status?: number;
    confirmations?: number;
};
export declare type FacetOptions = {
    name?: string;
    contract?: string | ArtifactData;
    args?: any[];
    linkedData?: any;
    libraries?: Libraries;
    deterministic?: boolean | string;
};
export declare type DiamondFacets = Array<string> | Array<FacetOptions>;
export interface DiamondOptions extends TxOptions {
    diamondContract?: string | ArtifactData;
    diamondContractArgs?: any[];
    owner?: Address;
    defaultOwnershipFacet?: boolean;
    defaultCutFacet?: boolean;
    facets: DiamondFacets;
    log?: boolean;
    libraries?: Libraries;
    linkedData?: any;
    upgradeIndex?: number;
    execute?: {
        contract?: string | {
            name: string;
            artifact: string | ArtifactData;
            args?: any[];
        };
        methodName: string;
        args: any[];
    };
    deterministicSalt?: string;
    facetsArgs?: any[];
}
declare type ProxyOptionsBase = {
    owner?: Address;
    upgradeIndex?: number;
    proxyContract?: // default to EIP173Proxy
    string | ArtifactData;
    proxyArgs?: any[];
    viaAdminContract?: string | {
        name: string;
        artifact?: string | ArtifactData;
    };
    implementationName?: string;
};
export declare type ProxyOptions = (ProxyOptionsBase & {
    methodName?: string;
}) | (ProxyOptionsBase & {
    execute?: {
        methodName: string;
        args: any[];
    } | {
        init: {
            methodName: string;
            args: any[];
        };
        onUpgrade?: {
            methodName: string;
            args: any[];
        };
    };
});
export declare type ArtifactData = {
    abi: ABI;
    bytecode: string;
    deployedBytecode?: string;
    metadata?: string;
    methodIdentifiers?: any;
    storageLayout?: any;
    userdoc?: any;
    devdoc?: any;
    gasEstimates?: any;
};
export interface DeployOptionsBase extends TxOptions {
    contract?: string | ArtifactData;
    args?: any[];
    skipIfAlreadyDeployed?: boolean;
    linkedData?: any;
    libraries?: Libraries;
    proxy?: boolean | string | ProxyOptions;
}
export interface DeployOptions extends DeployOptionsBase {
    deterministicDeployment?: boolean | string;
}
export interface Create2DeployOptions extends DeployOptionsBase {
    salt?: string;
}
export interface CallOptions {
    from?: string;
    gasLimit?: string | number | BigNumber;
    gasPrice?: string | BigNumber;
    maxFeePerGas?: string | BigNumber;
    maxPriorityFeePerGas?: string | BigNumber;
    value?: string | BigNumber;
    nonce?: string | number | BigNumber;
    to?: string;
    data?: string;
}
export interface TxOptions extends CallOptions {
    from: string;
    log?: boolean;
    autoMine?: boolean;
    estimatedGasLimit?: string | number | BigNumber;
    estimateGasExtra?: string | number | BigNumber;
    waitConfirmations?: number;
}
export interface Execute extends TxOptions {
    name: string;
    methodName: string;
    args?: any[];
}
export interface SimpleTx extends TxOptions {
    to: string;
}
export interface DeployedContract {
    address: Address;
    abi: ABI;
}
export interface DeployResult extends Deployment {
    newlyDeployed: boolean;
}
export declare type FixtureFunc<T, O> = (env: HardhatRuntimeEnvironment, options?: O) => Promise<T>;
export interface DeploymentsExtension {
    deploy(name: string, options: DeployOptions): Promise<DeployResult>;
    diamond: {
        deploy(name: string, options: DiamondOptions): Promise<DeployResult>;
    };
    deterministic(// return the determinsitic address as well as a function to deploy the contract, can pass the `salt` field in the option to use different salt
    name: string, options: Create2DeployOptions): Promise<{
        address: Address;
        implementationAddress?: Address;
        deploy(): Promise<DeployResult>;
    }>;
    fetchIfDifferent(// return true if new compiled code is different than deployed contract
    name: string, options: DeployOptions): Promise<{
        differences: boolean;
        address?: string;
    }>;
    readDotFile(name: string): Promise<string>;
    saveDotFile(name: string, content: string): Promise<void>;
    deleteDotFile(name: string): Promise<void>;
    save(name: string, deployment: DeploymentSubmission): Promise<void>;
    delete(name: string): Promise<void>;
    get(name: string): Promise<Deployment>;
    getOrNull(name: string): Promise<Deployment | null>;
    getDeploymentsFromAddress(address: string): Promise<Deployment[]>;
    all(): Promise<{
        [name: string]: Deployment;
    }>;
    getArtifact(name: string): Promise<Artifact>;
    getExtendedArtifact(name: string): Promise<ExtendedArtifact>;
    run(// execute deployment scripts
    tags?: string | string[], options?: {
        resetMemory?: boolean;
        deletePreviousDeployments?: boolean;
        writeDeploymentsToFiles?: boolean;
        export?: string;
        exportAll?: string;
    }): Promise<{
        [name: string]: Deployment;
    }>;
    fixture(// execute deployment as fixture for test // use evm_snapshot to revert back
    tags?: string | string[], options?: {
        fallbackToGlobal?: boolean;
        keepExistingDeployments?: boolean;
    }): Promise<{
        [name: string]: Deployment;
    }>;
    createFixture<T, O>(// execute a function as fixture using evm_snaphost to revert back each time
    func: FixtureFunc<T, O>, id?: string): (options?: O) => Promise<T>;
    log(...args: any[]): void;
    getNetworkName(): string;
    getGasUsed(): number;
    execute(// execute function call on contract
    name: string, options: TxOptions, methodName: string, ...args: any[]): Promise<Receipt>;
    rawTx(tx: SimpleTx): Promise<Receipt>;
    catchUnknownSigner(// you can wrap other function with this function and it will catch failure due to missing signer with the details of the tx to be executed
    action: Promise<any> | (() => Promise<any>), options?: {
        log?: boolean;
    }): Promise<null | {
        from: string;
        to?: string;
        value?: string;
        data?: string;
    }>;
    read(// make a read-only call to a contract
    name: string, options: CallOptions, methodName: string, ...args: any[]): Promise<any>;
    read(name: string, methodName: string, ...args: any[]): Promise<any>;
}
export interface ContractExport {
    address: string;
    abi: any[];
    linkedData?: any;
}
export interface Export {
    chainId: string;
    name: string;
    contracts: {
        [name: string]: ContractExport;
    };
}
export declare type MultiExport = {
    [chainId: string]: Export[];
};
export declare type Libraries = {
    [libraryName: string]: Address;
};
export declare enum FacetCutAction {
    Add = 0,
    Replace = 1,
    Remove = 2
}
export declare type FacetCut = Facet & {
    action: FacetCutAction;
};
export declare type Facet = {
    facetAddress: string;
    functionSelectors: string[];
};
export interface DeploymentSubmission {
    abi: ABI;
    address: Address;
    receipt?: Receipt;
    transactionHash?: string;
    history?: Deployment[];
    implementation?: string;
    args?: any[];
    linkedData?: any;
    solcInput?: string;
    solcInputHash?: string;
    metadata?: string;
    bytecode?: string;
    deployedBytecode?: string;
    userdoc?: any;
    devdoc?: any;
    methodIdentifiers?: any;
    facets?: Facet[];
    execute?: {
        methodName: string;
        args: any[];
    };
    storageLayout?: any;
    libraries?: Libraries;
    gasEstimates?: any;
}
export interface Deployment {
    address: Address;
    abi: ABI;
    receipt?: Receipt;
    transactionHash?: string;
    history?: Deployment[];
    numDeployments?: number;
    implementation?: string;
    args?: any[];
    linkedData?: any;
    solcInputHash?: string;
    metadata?: string;
    bytecode?: string;
    deployedBytecode?: string;
    libraries?: Libraries;
    userdoc?: any;
    devdoc?: any;
    methodIdentifiers?: any;
    facets?: Facet[];
    storageLayout?: any;
    gasEstimates?: any;
}
export interface DeterministicDeploymentInfo {
    factory: string;
    deployer: string;
    funding: string;
    signedTx: string;
}
export {};
//# sourceMappingURL=types.d.ts.map