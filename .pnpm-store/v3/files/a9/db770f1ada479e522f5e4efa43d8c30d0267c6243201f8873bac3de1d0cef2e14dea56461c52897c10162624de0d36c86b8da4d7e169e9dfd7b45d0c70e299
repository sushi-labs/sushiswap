/// <reference types="node" />
import { Block } from "@ethereumjs/block";
import Common from "@ethereumjs/common";
import { TypedTransaction } from "@ethereumjs/tx";
import { BN } from "ethereumjs-util";
import { BlockchainBase } from "./BlockchainBase";
import { FilterParams } from "./node-types";
import { RpcLogOutput } from "./output";
import { HardhatBlockchainInterface } from "./types/HardhatBlockchainInterface";
export declare class HardhatBlockchain extends BlockchainBase implements HardhatBlockchainInterface {
    private _length;
    constructor(common: Common);
    getLatestBlockNumber(): BN;
    addBlock(block: Block): Promise<Block>;
    reserveBlocks(count: BN, interval: BN, previousBlockStateRoot: Buffer, previousBlockTotalDifficulty: BN, previousBlockBaseFeePerGas: BN | undefined): void;
    deleteLaterBlocks(block: Block): void;
    getTotalDifficulty(blockHash: Buffer): Promise<BN>;
    getTransaction(transactionHash: Buffer): Promise<TypedTransaction | undefined>;
    getBlockByTransactionHash(transactionHash: Buffer): Promise<Block | null>;
    getTransactionReceipt(transactionHash: Buffer): Promise<import("./output").RpcReceiptOutput | null>;
    getLogs(filterParams: FilterParams): Promise<RpcLogOutput[]>;
    private _validateBlock;
    protected _delBlock(blockNumber: BN): void;
}
//# sourceMappingURL=HardhatBlockchain.d.ts.map