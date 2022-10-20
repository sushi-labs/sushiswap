import { BytesLike, BigNumberish, providers, BigNumber } from 'ethers';
export declare type Address = string;
export declare type Signature = string;
export declare enum Network {
    Mainnet = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Goerli = 5,
    Localhost = 9
}
export declare enum PriorityQueueType {
    Deque = 0,
    HeapBuffer = 1,
    Heap = 2
}
export declare enum PriorityOpTree {
    Full = 0,
    Rollup = 1
}
export declare enum TransactionStatus {
    NotFound = "not-found",
    Processing = "processing",
    Committed = "committed",
    Finalized = "finalized"
}
export declare type AAParams = {
    from: Address;
    signature: BytesLike;
};
export declare type Eip712Meta = {
    feeToken?: Address;
    ergsPerPubdata?: BigNumberish;
    factoryDeps?: BytesLike[];
    aaParams?: AAParams;
};
export declare type BlockTag = number | string | 'committed' | 'finalized' | 'latest' | 'earliest' | 'pending';
export declare type DeploymentType = 'create' | 'createAA';
export interface Token {
    l1Address: Address;
    l2Address: Address;
    /** @deprecated This field is here for backward compatibility - please use l2Address field instead */
    address: Address;
    name: string;
    symbol: string;
    decimals: number;
}
export interface MessageProof {
    id: number;
    proof: string[];
    root: string;
}
export interface EventFilter {
    topics?: Array<string | Array<string> | null>;
    address?: Address | Array<Address>;
    limit?: number;
    fromBlock?: BlockTag;
    toBlock?: BlockTag;
    blockHash?: string;
}
export interface TransactionResponse extends providers.TransactionResponse {
    waitFinalize(): Promise<providers.TransactionReceipt>;
}
export declare type TransactionRequest = providers.TransactionRequest & {
    customData?: Eip712Meta;
};
export interface PriorityOpResponse extends TransactionResponse {
    waitL1Commit(confirmation?: number): Promise<providers.TransactionReceipt>;
}
export declare type BalancesMap = {
    [key: string]: BigNumber;
};
export interface DeploymentInfo {
    sender: Address;
    bytecodeHash: string;
    deployedAddress: Address;
}
