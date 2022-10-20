import { RPC_CALLS } from '../eth/constants';

export type RpcCallNames = keyof typeof RPC_CALLS;

export type RPCPayload<P = unknown[]> = {
  call: RpcCallNames;
  params: P | unknown[];
};

export interface Log {
  address: string;
  data: string;
  topics: string[];
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
}

export interface Web3TransactionReceiptObject {
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  from: string;
  to: string | null;
  cumulativeGasUsed: number;
  gasUsed: number;
  contractAddress: string;
  logs: Log[];
  logsBloom: string;
  status: number | undefined;
}

export interface Web3TransactionObject {
  hash: string;
  nonce: number;
  blockHash: string | null;
  blockNumber: number | null;
  transactionIndex: number | null;
  from: string;
  to: string | null;
  value: string;
  gasPrice: string;
  gas: number;
  input: string;
}

export type BlockNumberArg = number | 'earliest' | 'latest' | 'pending';

export interface PastLogsOptions {
  fromBlock?: BlockNumberArg;
  toBlock?: BlockNumberArg;
  address?: string;
  topics?: Array<string | string[] | null>;
}

export interface TransactionConfig {
  from?: string | number;
  to?: string;
  value?: number | string;
  gas?: number | string;
  gasPrice?: number | string;
  data?: string;
  nonce?: number;
}

export interface BlockHeader {
  number: number;
  hash: string;
  parentHash: string;
  nonce: string;
  sha3Uncles: string;
  logsBloom: string;
  transactionRoot: string;
  stateRoot: string;
  receiptRoot: string;
  miner: string;
  extraData: string;
  gasLimit: number;
  gasUsed: number;
  timestamp: number | string;
}

export interface BlockTransactionBase extends BlockHeader {
  size: number;
  difficulty: number;
  totalDifficulty: number;
  uncles: string[];
}

export interface BlockTransactionObject extends BlockTransactionBase {
  transactions: Web3TransactionObject[];
}

export interface BlockTransactionString extends BlockTransactionBase {
  transactions: string[];
}
