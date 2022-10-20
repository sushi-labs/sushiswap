"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TXs = void 0;
const methods_1 = require("../communication/methods");
const types_1 = require("../types");
class TXs {
    constructor(communicator) {
        this.communicator = communicator;
    }
    async getBySafeTxHash(safeTxHash) {
        if (!safeTxHash) {
            throw new Error('Invalid safeTxHash');
        }
        const response = await this.communicator.send(methods_1.Methods.getTxBySafeTxHash, { safeTxHash });
        return response.data;
    }
    async signMessage(message) {
        const messagePayload = {
            message,
        };
        const response = await this.communicator.send(methods_1.Methods.signMessage, messagePayload);
        return response.data;
    }
    async signTypedMessage(typedData) {
        if (!(0, types_1.isObjectEIP712TypedData)(typedData)) {
            throw new Error('Invalid typed data');
        }
        const response = await this.communicator.send(methods_1.Methods.signTypedMessage, { typedData });
        return response.data;
    }
    async send({ txs, params }) {
        if (!txs || !txs.length) {
            throw new Error('No transactions were passed');
        }
        const messagePayload = {
            txs,
            params,
        };
        const response = await this.communicator.send(methods_1.Methods.sendTransactions, messagePayload);
        return response.data;
    }
}
exports.TXs = TXs;
//# sourceMappingURL=index.js.map