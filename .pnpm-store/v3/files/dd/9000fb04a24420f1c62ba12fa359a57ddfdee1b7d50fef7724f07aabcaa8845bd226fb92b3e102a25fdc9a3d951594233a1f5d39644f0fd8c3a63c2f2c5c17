/// <reference types="node" />
import { Block } from "@ethereumjs/block";
import Common from "@ethereumjs/common";
import { TypedTransaction } from "@ethereumjs/tx";
import { BN } from "ethereumjs-util";
import { JsonRpcClient } from "../../jsonrpc/client";
import { BlockchainBase } from "../BlockchainBase";
import { FilterParams } from "../node-types";
import { RpcLogOutput, RpcReceiptOutput } from "../output";
import { HardhatBlockchainInterface } from "../types/HardhatBlockchainInterface";
export declare class ForkBlockchain extends BlockchainBase implements HardhatBlockchainInterface {
    private _jsonRpcClient;
    private _forkBlockNumber;
    private _latestBlockNumber;
    constructor(_jsonRpcClient: JsonRpcClient, _forkBlockNumber: BN, common: Common);
    getLatestBlockNumber(): BN;
    getBlock(blockHashOrNumber: Buffer | number | BN): Promise<Block | null>;
    addBlock(block: Block): Promise<Block>;
    reserveBlocks(count: BN, interval: BN, previousBlockStateRoot: Buffer, previousBlockTotalDifficulty: BN, previousBlockBaseFeePerGas: BN | undefined): void;
    deleteLaterBlocks(block: Block): void;
    getTotalDifficulty(blockHash: Buffer): Promise<BN>;
    getTransaction(transactionHash: Buffer): Promise<TypedTransaction | undefined>;
    getBlockByTransactionHash(transactionHash: Buffer): Promise<Block | null>;
    getTransactionReceipt(transactionHash: Buffer): Promise<RpcReceiptOutput | null>;
    getForkBlockNumber(): BN;
    getLogs(filterParams: FilterParams): Promise<RpcLogOutput[]>;
    private _getBlockByHash;
    private _getBlockByNumber;
    private _processRemoteBlock;
    protected _delBlock(blockNumber: BN): void;
    private _processRemoteTransaction;
    private _processRemoteReceipt;
}
//# sourceMappingURL=ForkBlockchain.d.ts.map