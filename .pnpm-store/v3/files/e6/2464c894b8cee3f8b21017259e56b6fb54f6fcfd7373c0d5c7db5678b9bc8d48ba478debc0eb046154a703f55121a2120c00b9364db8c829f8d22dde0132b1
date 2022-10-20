"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = __importDefault(require("@json-rpc-tools/provider"));
const utils_1 = require("@json-rpc-tools/utils");
class EthereumProvider extends provider_1.default {
    enable() {
        return this.request(utils_1.formatJsonRpcRequest("eth_requestAccounts", []));
    }
}
exports.EthereumProvider = EthereumProvider;
//# sourceMappingURL=provider.js.map