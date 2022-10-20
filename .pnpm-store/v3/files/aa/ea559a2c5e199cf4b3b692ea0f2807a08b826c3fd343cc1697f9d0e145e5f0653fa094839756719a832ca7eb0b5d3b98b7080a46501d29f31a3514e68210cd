import { BytesLike, BigNumberish, providers, BigNumber } from 'ethers';

// 0x-prefixed, hex encoded, ethereum account address
export type Address = string;
// 0x-prefixed, hex encoded, ECDSA signature.
export type Signature = string;

// Ethereum network
export enum Network {
    Mainnet = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Goerli = 5,
    Localhost = 9
}

export enum PriorityQueueType {
    Deque = 0,
    HeapBuffer = 1,
    Heap = 2
}

export enum PriorityOpTree {
    Full = 0,
    Rollup = 1
}

export enum TransactionStatus {
    NotFound = 'not-found',
    Processing = 'processing',
    Committed = 'committed',
    Finalized = 'finalized'
}

export type AAParams = {
    from: Address;
    signature: BytesLike;
};

export type Eip712Meta = {
    feeToken?: Address;
    ergsPerPubdata?: BigNumberish;
    factoryDeps?: BytesLike[];
    aaParams?: AAParams;
};

// prettier-ignore
export type BlockTag =
    | number
    | string // hex number
    | 'committed'
    | 'finalized'
    | 'latest'
    | 'earliest'
    | 'pending';

// TODO: support create2 variants
export type DeploymentType = 'create' | 'createAA';

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

export type TransactionRequest = providers.TransactionRequest & { customData?: Eip712Meta };

export interface PriorityOpResponse extends TransactionResponse {
    waitL1Commit(confirmation?: number): Promise<providers.TransactionReceipt>;
}

export type BalancesMap = { [key: string]: BigNumber };

export interface DeploymentInfo {
    sender: Address;
    bytecodeHash: string;
    deployedAddress: Address;
}
