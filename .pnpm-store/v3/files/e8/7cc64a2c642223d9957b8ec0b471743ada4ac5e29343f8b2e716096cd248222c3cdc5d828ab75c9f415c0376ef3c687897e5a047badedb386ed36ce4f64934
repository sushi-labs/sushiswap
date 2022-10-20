"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSDKRelayEventManager = void 0;
const util_1 = require("../util");
class WalletSDKRelayEventManager {
    constructor() {
        this._nextRequestId = 0;
        this.callbacks = new Map();
    }
    makeRequestId() {
        // max nextId == max int32 for compatibility with mobile
        this._nextRequestId = (this._nextRequestId + 1) % 0x7fffffff;
        const id = this._nextRequestId;
        const idStr = (0, util_1.prepend0x)(id.toString(16));
        // unlikely that this will ever be an issue, but just to be safe
        const callback = this.callbacks.get(idStr);
        if (callback) {
            this.callbacks.delete(idStr);
        }
        return id;
    }
}
exports.WalletSDKRelayEventManager = WalletSDKRelayEventManager;
