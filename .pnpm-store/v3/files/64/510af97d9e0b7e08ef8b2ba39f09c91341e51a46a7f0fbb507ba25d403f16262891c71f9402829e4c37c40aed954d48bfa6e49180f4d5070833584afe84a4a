/// <reference types="node" />
import { Block } from "@ethereumjs/block";
import Common from "@ethereumjs/common";
import { TypedTransaction } from "@ethereumjs/tx";
import { BN } from "ethereumjs-util";
import { FilterParams } from "./node-types";
import { RpcLogOutput, RpcReceiptOutput } from "./output";
interface Reservation {
    first: BN;
    last: BN;
    interval: BN;
    previousBlockStateRoot: Buffer;
    previousBlockTotalDifficulty: BN;
    previousBlockBaseFeePerGas: BN | undefined;
}
export declare class BlockchainData {
    private _common;
    private _blocksByNumber;
    private _blocksByHash;
    private _blocksByTransactions;
    private _transactions;
    private _transactionReceipts;
    private _totalDifficulty;
    private _blockReservations;
    constructor(_common: Common);
    reserveBlocks(first: BN, count: BN, interval: BN, previousBlockStateRoot: Buffer, previousBlockTotalDifficulty: BN, previousBlockBaseFeePerGas: BN | undefined): void;
    getBlockByNumber(blockNumber: BN): Block | undefined;
    getBlockByHash(blockHash: Buffer): Block | undefined;
    getBlockByTransactionHash(transactionHash: Buffer): Block | undefined;
    getTransaction(transactionHash: Buffer): TypedTransaction | undefined;
    getTransactionReceipt(transactionHash: Buffer): RpcReceiptOutput | undefined;
    getTotalDifficulty(blockHash: Buffer): BN | undefined;
    getLogs(filterParams: FilterParams): RpcLogOutput[];
    addBlock(block: Block, totalDifficulty: BN): void;
    /**
     * WARNING: this method can leave the blockchain in an invalid state where
     * there are gaps between blocks. Ideally we should have a method that removes
     * the given block and all the following blocks.
     */
    removeBlock(block: Block): void;
    addTransaction(transaction: TypedTransaction): void;
    addTransactionReceipt(receipt: RpcReceiptOutput): void;
    isReservedBlock(blockNumber: BN): boolean;
    private _findBlockReservation;
    /**
     * WARNING: this method only removes the given reservation and can result in
     * gaps in the reservations array. Ideally we should have a method that
     * removes the given reservation and all the following reservations.
     */
    private _removeReservation;
    /**
     * Cancel and return the reservation that has block `blockNumber`
     */
    cancelReservationWithBlock(blockNumber: BN): Reservation;
    fulfillBlockReservation(blockNumber: BN): void;
    private _calculateTimestampForReservedBlock;
}
export {};
//# sourceMappingURL=BlockchainData.d.ts.map