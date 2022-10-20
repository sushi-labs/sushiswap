"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardhatBlockchain = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
const BlockchainBase_1 = require("./BlockchainBase");
/* eslint-disable @nomiclabs/hardhat-internal-rules/only-hardhat-error */
class HardhatBlockchain extends BlockchainBase_1.BlockchainBase {
    constructor(common) {
        super(common);
        this._length = 0;
    }
    getLatestBlockNumber() {
        return new ethereumjs_util_1.BN(this._length - 1);
    }
    async addBlock(block) {
        this._validateBlock(block);
        const totalDifficulty = await this._computeTotalDifficulty(block);
        this._data.addBlock(block, totalDifficulty);
        this._length += 1;
        return block;
    }
    reserveBlocks(count, interval, previousBlockStateRoot, previousBlockTotalDifficulty, previousBlockBaseFeePerGas) {
        super.reserveBlocks(count, interval, previousBlockStateRoot, previousBlockTotalDifficulty, previousBlockBaseFeePerGas);
        this._length = this._length + count.toNumber();
    }
    deleteLaterBlocks(block) {
        const actual = this._data.getBlockByHash(block.hash());
        if (actual === undefined) {
            throw new Error("Invalid block");
        }
        this._delBlock(actual.header.number.addn(1));
    }
    async getTotalDifficulty(blockHash) {
        const totalDifficulty = this._data.getTotalDifficulty(blockHash);
        if (totalDifficulty === undefined) {
            throw new Error("Block not found");
        }
        return totalDifficulty;
    }
    async getTransaction(transactionHash) {
        return this.getLocalTransaction(transactionHash);
    }
    async getBlockByTransactionHash(transactionHash) {
        const block = this._data.getBlockByTransactionHash(transactionHash);
        return block !== null && block !== void 0 ? block : null;
    }
    async getTransactionReceipt(transactionHash) {
        var _a;
        return (_a = this._data.getTransactionReceipt(transactionHash)) !== null && _a !== void 0 ? _a : null;
    }
    async getLogs(filterParams) {
        return this._data.getLogs(filterParams);
    }
    _validateBlock(block) {
        const blockNumber = block.header.number.toNumber();
        const parentHash = block.header.parentHash;
        const parent = this._data.getBlockByNumber(new ethereumjs_util_1.BN(blockNumber - 1));
        if (this._length !== blockNumber) {
            throw new Error(`Invalid block number ${blockNumber}. Expected ${this._length}.`);
        }
        if ((blockNumber === 0 && !parentHash.equals((0, ethereumjs_util_1.zeros)(32))) ||
            (blockNumber > 0 &&
                parent !== undefined &&
                !parentHash.equals(parent.hash()))) {
            throw new Error("Invalid parent hash");
        }
    }
    _delBlock(blockNumber) {
        super._delBlock(blockNumber);
        this._length = blockNumber.toNumber();
    }
}
exports.HardhatBlockchain = HardhatBlockchain;
//# sourceMappingURL=HardhatBlockchain.js.map