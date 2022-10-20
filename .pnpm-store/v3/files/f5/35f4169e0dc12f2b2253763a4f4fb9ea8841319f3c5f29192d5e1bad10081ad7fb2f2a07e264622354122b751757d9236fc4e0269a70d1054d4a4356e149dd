"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSDKRelayAbstract = exports.APP_VERSION_KEY = exports.LOCAL_STORAGE_ADDRESSES_KEY = exports.WALLET_USER_NAME_KEY = void 0;
const eth_rpc_errors_1 = require("eth-rpc-errors");
exports.WALLET_USER_NAME_KEY = "walletUsername";
exports.LOCAL_STORAGE_ADDRESSES_KEY = "Addresses";
exports.APP_VERSION_KEY = "AppVersion";
class WalletSDKRelayAbstract {
    async makeEthereumJSONRPCRequest(request, jsonRpcUrl) {
        if (!jsonRpcUrl)
            throw new Error("Error: No jsonRpcUrl provided");
        return window
            .fetch(jsonRpcUrl, {
            method: "POST",
            body: JSON.stringify(request),
            mode: "cors",
            headers: { "Content-Type": "application/json" },
        })
            .then(res => res.json())
            .then(json => {
            if (!json) {
                throw eth_rpc_errors_1.ethErrors.rpc.parse({});
            }
            const response = json;
            const { error } = response;
            if (error) {
                throw (0, eth_rpc_errors_1.serializeError)(error);
            }
            return response;
        });
    }
}
exports.WalletSDKRelayAbstract = WalletSDKRelayAbstract;
