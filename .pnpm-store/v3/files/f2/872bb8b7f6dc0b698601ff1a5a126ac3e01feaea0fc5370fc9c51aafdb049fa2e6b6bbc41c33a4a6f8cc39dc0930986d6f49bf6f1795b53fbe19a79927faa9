"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const communication_1 = __importDefault(require("./communication"));
const txs_1 = require("./txs");
const eth_1 = require("./eth");
const safe_1 = require("./safe");
const wallet_1 = require("./wallet");
class SafeAppsSDK {
    constructor(opts = {}) {
        const { allowedDomains = null, debug = false } = opts;
        this.communicator = new communication_1.default(allowedDomains, debug);
        this.eth = new eth_1.Eth(this.communicator);
        this.txs = new txs_1.TXs(this.communicator);
        this.safe = new safe_1.Safe(this.communicator);
        this.wallet = new wallet_1.Wallet(this.communicator);
    }
}
exports.default = SafeAppsSDK;
//# sourceMappingURL=sdk.js.map