"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.L1Signer = exports.Signer = exports.EIP712Signer = exports.eip712Types = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("./utils");
const hash_1 = require("@ethersproject/hash");
const adapters_1 = require("./adapters");
exports.eip712Types = {
    Transaction: [
        { name: 'txType', type: 'uint8' },
        { name: 'to', type: 'uint256' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'feeToken', type: 'uint256' },
        { name: 'ergsLimit', type: 'uint256' },
        { name: 'ergsPerPubdataByteLimit', type: 'uint256' },
        { name: 'ergsPrice', type: 'uint256' },
        { name: 'nonce', type: 'uint256' }
    ]
};
class EIP712Signer {
    constructor(ethSigner, chainId) {
        this.ethSigner = ethSigner;
        this.eip712Domain = Promise.resolve(chainId).then((chainId) => ({
            name: 'zkSync',
            version: '2',
            chainId
        }));
    }
    static getSignInput(transaction) {
        return {
            txType: transaction.type,
            to: transaction.to,
            feeToken: transaction.customData.feeToken,
            ergsLimit: transaction.gasLimit,
            ergsPerPubdataByteLimit: transaction.customData.ergsPerPubdata,
            ergsPrice: transaction.gasPrice,
            nonce: transaction.nonce,
            value: transaction.value,
            data: transaction.data
        };
    }
    async sign(transaction) {
        return await this.ethSigner._signTypedData(await this.eip712Domain, exports.eip712Types, EIP712Signer.getSignInput(transaction));
    }
    static getSignedDigest(transaction) {
        if (!transaction.chainId) {
            throw Error("Transaction chainId isn't set");
        }
        const domain = {
            name: 'zkSync',
            version: '2',
            chainId: transaction.chainId
        };
        return hash_1._TypedDataEncoder.hash(domain, exports.eip712Types, EIP712Signer.getSignInput(transaction));
    }
}
exports.EIP712Signer = EIP712Signer;
// This class is to be used on the frontend, with metamask injection.
// It only contains L2 operations. For L1 operations, see L1Signer.
// Sample usage:
// const provider = new zkweb3.Web3Provider(window.ethereum);
// const signer = provider.getSigner();
// const tx = await signer.sendTransaction({ ... });
class Signer extends (0, adapters_1.AdapterL2)(ethers_1.ethers.providers.JsonRpcSigner) {
    _signerL2() {
        return this;
    }
    _providerL2() {
        return this.provider;
    }
    static from(signer) {
        const newSigner = Object.setPrototypeOf(signer, Signer.prototype);
        // @ts-ignore
        newSigner.eip712 = new EIP712Signer(newSigner, newSigner.getChainId());
        return newSigner;
    }
    // an alias with a better name
    async getNonce(blockTag) {
        return await this.getTransactionCount(blockTag);
    }
    async sendTransaction(transaction) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (transaction.customData == null && transaction.type == null) {
            // use legacy txs by default
            transaction.type = 0;
        }
        if (transaction.customData == null && transaction.type != utils_1.EIP712_TX_TYPE) {
            return (await super.sendTransaction(transaction));
        }
        else {
            const address = await this.getAddress();
            (_a = transaction.from) !== null && _a !== void 0 ? _a : (transaction.from = address);
            if (transaction.from.toLowerCase() != address.toLowerCase()) {
                throw new Error('Transaction `from` address mismatch');
            }
            transaction.type = utils_1.EIP712_TX_TYPE;
            (_b = transaction.value) !== null && _b !== void 0 ? _b : (transaction.value = 0);
            (_c = transaction.data) !== null && _c !== void 0 ? _c : (transaction.data = '0x');
            (_d = transaction.nonce) !== null && _d !== void 0 ? _d : (transaction.nonce = await this.getNonce());
            transaction.customData = this._fillCustomData(transaction.customData);
            (_e = transaction.gasPrice) !== null && _e !== void 0 ? _e : (transaction.gasPrice = await this.provider.getGasPrice(transaction.customData.feeToken));
            (_f = transaction.gasLimit) !== null && _f !== void 0 ? _f : (transaction.gasLimit = await this.provider.estimateGas(transaction));
            (_g = transaction.chainId) !== null && _g !== void 0 ? _g : (transaction.chainId = (await this.provider.getNetwork()).chainId);
            const signature = await this.eip712.sign(transaction);
            transaction.customData.aaParams = {
                from: address,
                signature
            };
            const txBytes = (0, utils_1.serialize)(transaction, signature);
            return await this.provider.sendTransaction(txBytes);
        }
    }
}
exports.Signer = Signer;
// This class is to be used on the frontend with metamask injection.
// It only contains L1 operations. For L2 operations, see Signer.
// Sample usage:
// const provider = new ethers.Web3Provider(window.ethereum);
// const zksyncProvider = new zkweb3.Provider('<rpc_url>');
// const signer = zkweb3.L1Signer.from(provider.getSigner(), zksyncProvider);
// const tx = await signer.deposit({ ... });
class L1Signer extends (0, adapters_1.AdapterL1)(ethers_1.ethers.providers.JsonRpcSigner) {
    _providerL2() {
        return this.providerL2;
    }
    _providerL1() {
        return this.provider;
    }
    _signerL1() {
        return this;
    }
    static from(signer, zksyncProvider) {
        const newSigner = Object.setPrototypeOf(signer, L1Signer.prototype);
        newSigner.providerL2 = zksyncProvider;
        return newSigner;
    }
    connectToL2(provider) {
        this.providerL2 = provider;
        return this;
    }
}
exports.L1Signer = L1Signer;
