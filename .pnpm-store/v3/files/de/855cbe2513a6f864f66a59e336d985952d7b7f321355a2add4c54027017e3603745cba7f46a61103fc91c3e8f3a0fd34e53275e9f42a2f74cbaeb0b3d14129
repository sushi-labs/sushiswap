"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockRelayClass = void 0;
const provider_1 = require("../fixtures/provider");
const ScopedLocalStorage_1 = require("../lib/ScopedLocalStorage");
const Session_1 = require("../relay/Session");
const WalletSDKRelayAbstract_1 = require("../relay/WalletSDKRelayAbstract");
const Web3Method_1 = require("../relay/Web3Method");
const types_1 = require("../types");
function makeMockReturn(returnValue) {
    return { cancel: () => { }, promise: Promise.resolve(returnValue) };
}
class MockRelayClass extends WalletSDKRelayAbstract_1.WalletSDKRelayAbstract {
    constructor() {
        super();
        this.requestEthereumAccounts = this.requestEthereumAccounts.bind(this);
    }
    resetAndReload() { }
    requestEthereumAccounts() {
        return makeMockReturn({
            method: Web3Method_1.Web3Method.requestEthereumAccounts,
            result: [(0, types_1.AddressString)(provider_1.MOCK_ADDERESS)],
        });
    }
    addEthereumChain() {
        return makeMockReturn({
            method: Web3Method_1.Web3Method.addEthereumChain,
            result: {
                isApproved: true,
                rpcUrl: "https://node.ethchain.com",
            },
        });
    }
    watchAsset() {
        return makeMockReturn({
            method: Web3Method_1.Web3Method.watchAsset,
            result: true,
        });
    }
    selectProvider() {
        return makeMockReturn({
            method: Web3Method_1.Web3Method.selectProvider,
            result: types_1.ProviderType.CoinbaseWallet,
        });
    }
    switchEthereumChain() {
        return makeMockReturn({
            method: Web3Method_1.Web3Method.switchEthereumChain,
            result: {
                isApproved: true,
                rpcUrl: "https://node.ethchain.com",
            },
        });
    }
    signEthereumMessage() {
        return makeMockReturn({
            method: Web3Method_1.Web3Method.signEthereumMessage,
            result: (0, types_1.HexString)("0x"),
        });
    }
    ethereumAddressFromSignedMessage() {
        return makeMockReturn({
            method: Web3Method_1.Web3Method.ethereumAddressFromSignedMessage,
            result: (0, types_1.AddressString)(provider_1.MOCK_ADDERESS),
        });
    }
    signEthereumTransaction() {
        return makeMockReturn({
            method: Web3Method_1.Web3Method.signEthereumTransaction,
            result: (0, types_1.HexString)(provider_1.MOCK_TX),
        });
    }
    signAndSubmitEthereumTransaction() {
        return makeMockReturn({
            method: Web3Method_1.Web3Method.submitEthereumTransaction,
            result: (0, types_1.HexString)(provider_1.MOCK_TX),
        });
    }
    submitEthereumTransaction() {
        return makeMockReturn({
            method: Web3Method_1.Web3Method.submitEthereumTransaction,
            result: (0, types_1.HexString)(provider_1.MOCK_TX),
        });
    }
    scanQRCode() {
        return makeMockReturn();
    }
    genericRequest() {
        return makeMockReturn({
            method: Web3Method_1.Web3Method.generic,
            result: "Success",
        });
    }
    sendRequest() {
        return makeMockReturn();
    }
    setAppInfo() {
        return;
    }
    inlineAddEthereumChain() {
        return false;
    }
    setAccountsCallback() {
        return;
    }
    setChainCallback() {
        return;
    }
    get session() {
        return new Session_1.Session(new ScopedLocalStorage_1.ScopedLocalStorage("session-test"));
    }
}
exports.MockRelayClass = MockRelayClass;
