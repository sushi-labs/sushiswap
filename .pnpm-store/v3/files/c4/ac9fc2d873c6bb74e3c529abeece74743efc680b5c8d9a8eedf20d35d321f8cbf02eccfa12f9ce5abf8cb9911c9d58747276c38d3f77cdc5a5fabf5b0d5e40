import { BlockNumberArg, Communicator, Log, BlockTransactionString, BlockTransactionObject, Web3TransactionObject, TransactionConfig, Web3TransactionReceiptObject, PastLogsOptions } from '../types';
declare class Eth {
    call: (params?: [TransactionConfig, (string | undefined)?] | undefined) => Promise<string>;
    getBalance: (params?: [string, (string | undefined)?] | undefined) => Promise<string>;
    getCode: (params?: [string, (string | undefined)?] | undefined) => Promise<string>;
    getStorageAt: (params?: [string, number, (string | undefined)?] | undefined) => Promise<string>;
    getPastLogs: (params?: [PastLogsOptions] | undefined) => Promise<Log[]>;
    getBlockByHash: (params?: [string, (boolean | undefined)?] | undefined) => Promise<BlockTransactionObject | BlockTransactionString>;
    getBlockByNumber: (params?: [BlockNumberArg, (boolean | undefined)?] | undefined) => Promise<BlockTransactionObject | BlockTransactionString>;
    getTransactionByHash: (params?: [string] | undefined) => Promise<Web3TransactionObject>;
    getTransactionReceipt: (params?: [string] | undefined) => Promise<Web3TransactionReceiptObject>;
    getTransactionCount: (params?: [string, (string | undefined)?] | undefined) => Promise<string>;
    getGasPrice: (params?: never[] | undefined) => Promise<string>;
    getEstimateGas: (transaction: TransactionConfig) => Promise<number>;
    private readonly communicator;
    constructor(communicator: Communicator);
    private buildRequest;
}
export { Eth };
