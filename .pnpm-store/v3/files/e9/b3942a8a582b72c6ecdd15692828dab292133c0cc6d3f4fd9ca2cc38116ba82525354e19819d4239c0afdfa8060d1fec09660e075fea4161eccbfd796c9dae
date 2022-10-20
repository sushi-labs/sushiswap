"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletUIError = void 0;
class WalletUIError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
    }
}
exports.WalletUIError = WalletUIError;
WalletUIError.UserRejectedRequest = new WalletUIError("User rejected request");
WalletUIError.SwitchEthereumChainUnsupportedChainId = new WalletUIError("Unsupported chainId", 4902);
