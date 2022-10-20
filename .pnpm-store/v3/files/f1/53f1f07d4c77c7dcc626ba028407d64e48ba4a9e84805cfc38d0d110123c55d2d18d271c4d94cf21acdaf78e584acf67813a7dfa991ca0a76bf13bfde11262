"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainBase = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
const errors_1 = require("../../core/errors");
const BlockchainData_1 = require("./BlockchainData");
/* eslint-disable @nomiclabs/hardhat-internal-rules/only-hardhat-error */
class BlockchainBase {
    constructor(_common) {
        this._common = _common;
        this._data = new BlockchainData_1.BlockchainData(_common);
    }
    addTransactionReceipts(receipts) {
        for (const receipt of receipts) {
            this._data.addTransactionReceipt(receipt);
        }
    }
    async delBlock(blockHash) {
        this.deleteBlock(blockHash);
    }
    deleteBlock(blockHash) {
        const block = this._data.getBlockByHash(blockHash);
        if (block === undefined) {
            throw new Error("Block not found");
        }
        this._delBlock(block.header.number);
    }
    async getBlock(blockHashOrNumber) {
        var _a, _b, _c;
        if ((typeof blockHashOrNumber === "number" || ethereumjs_util_1.BN.isBN(blockHashOrNumber)) &&
            this._data.isReservedBlock(new ethereumjs_util_1.BN(blockHashOrNumber))) {
            this._data.fulfillBlockReservation(new ethereumjs_util_1.BN(blockHashOrNumber));
        }
        if (typeof blockHashOrNumber === "number") {
            return (_a = this._data.getBlockByNumber(new ethereumjs_util_1.BN(blockHashOrNumber))) !== null && _a !== void 0 ? _a : null;
        }
        if (ethereumjs_util_1.BN.isBN(blockHashOrNumber)) {
            return (_b = this._data.getBlockByNumber(blockHashOrNumber)) !== null && _b !== void 0 ? _b : null;
        }
        return (_c = this._data.getBlockByHash(blockHashOrNumber)) !== null && _c !== void 0 ? _c : null;
    }
    async getLatestBlock() {
        const block = await this.getBlock(this.getLatestBlockNumber());
        if (block === null) {
            throw new Error("Block not found");
        }
        return block;
    }
    getLocalTransaction(transactionHash) {
        return this._data.getTransaction(transactionHash);
    }
    iterator(_name, _onBlock) {
        throw new Error("Method not implemented.");
    }
    async putBlock(block) {
        await this.addBlock(block);
    }
    reserveBlocks(count, interval, previousBlockStateRoot, previousBlockTotalDifficulty, previousBlockBaseFeePerGas) {
        this._data.reserveBlocks(this.getLatestBlockNumber().addn(1), count, interval, previousBlockStateRoot, previousBlockTotalDifficulty, previousBlockBaseFeePerGas);
    }
    _delBlock(blockNumber) {
        let i = blockNumber;
        while (i.lte(this.getLatestBlockNumber())) {
            if (this._data.isReservedBlock(i)) {
                const reservation = this._data.cancelReservationWithBlock(i);
                i = reservation.last.addn(1);
            }
            else {
                const current = this._data.getBlockByNumber(i);
                if (current !== undefined) {
                    this._data.removeBlock(current);
                }
                i = i.addn(1);
            }
        }
    }
    async _computeTotalDifficulty(block) {
        const difficulty = block.header.difficulty;
        const blockNumber = block.header.number;
        if (blockNumber.eqn(0)) {
            return difficulty;
        }
        const parentBlock = await this.getBlock(blockNumber.subn(1));
        (0, errors_1.assertHardhatInvariant)(parentBlock !== null, "Parent block should exist");
        const parentHash = parentBlock.hash();
        const parentTD = this._data.getTotalDifficulty(parentHash);
        (0, errors_1.assertHardhatInvariant)(parentTD !== undefined, "Parent block should have total difficulty");
        return parentTD.add(difficulty);
    }
}
exports.BlockchainBase = BlockchainBase;
//# sourceMappingURL=BlockchainBase.js.map