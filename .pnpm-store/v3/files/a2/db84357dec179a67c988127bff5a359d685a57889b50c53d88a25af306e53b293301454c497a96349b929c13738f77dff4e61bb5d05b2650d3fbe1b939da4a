"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockExtensionProvider = exports.MockProviderClass = exports.mockSetAppInfo = void 0;
const ScopedLocalStorage_1 = require("../lib/ScopedLocalStorage");
const CoinbaseWalletProvider_1 = require("../provider/CoinbaseWalletProvider");
const WalletSDKRelayEventManager_1 = require("../relay/WalletSDKRelayEventManager");
exports.mockSetAppInfo = jest.fn();
class MockProviderClass extends CoinbaseWalletProvider_1.CoinbaseWalletProvider {
    constructor(opts) {
        super(opts);
    }
    async close() {
        return Promise.resolve();
    }
    // @ts-expect-error mock relay
    async initializeRelay() {
        return Promise.resolve({
            setAppInfo: exports.mockSetAppInfo,
        });
    }
}
exports.MockProviderClass = MockProviderClass;
exports.mockExtensionProvider = new MockProviderClass({
    jsonRpcUrl: "jsonrpc-url",
    overrideIsMetaMask: false,
    relayEventManager: new WalletSDKRelayEventManager_1.WalletSDKRelayEventManager(),
    relayProvider: jest.fn(),
    storage: new ScopedLocalStorage_1.ScopedLocalStorage("-walletlink"),
});
