/// <reference types="node" />
import { Block } from "@ethereumjs/block";
import Common from "@ethereumjs/common";
import { TypedTransaction } from "@ethereumjs/tx";
import { BN } from "ethereumjs-util";
import { BlockchainData } from "./BlockchainData";
import { RpcReceiptOutput } from "./output";
export declare abstract class BlockchainBase {
    protected _common: Common;
    protected readonly _data: BlockchainData;
    constructor(_common: Common);
    abstract addBlock(block: Block): Promise<Block>;
    addTransactionReceipts(receipts: RpcReceiptOutput[]): void;
    delBlock(blockHash: Buffer): Promise<void>;
    deleteBlock(blockHash: Buffer): void;
    getBlock(blockHashOrNumber: Buffer | BN | number): Promise<Block | null>;
    abstract getLatestBlockNumber(): BN;
    getLatestBlock(): Promise<Block>;
    getLocalTransaction(transactionHash: Buffer): TypedTransaction | undefined;
    iterator(_name: string, _onBlock: (block: Block, reorg: boolean) => void | Promise<void>): Promise<number | void>;
    putBlock(block: Block): Promise<void>;
    reserveBlocks(count: BN, interval: BN, previousBlockStateRoot: Buffer, previousBlockTotalDifficulty: BN, previousBlockBaseFeePerGas: BN | undefined): void;
    protected _delBlock(blockNumber: BN): void;
    protected _computeTotalDifficulty(block: Block): Promise<BN>;
}
//# sourceMappingURL=BlockchainBase.d.ts.map