"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const eventemitter3_1 = tslib_1.__importDefault(require("eventemitter3"));
const jsonrpc_provider_1 = require("@walletconnect/jsonrpc-provider");
const jsonrpc_http_connection_1 = require("@walletconnect/jsonrpc-http-connection");
const utils_1 = require("@walletconnect/utils");
const signer_connection_1 = require("@walletconnect/signer-connection");
class WalletConnectProvider {
    constructor(opts) {
        this.events = new eventemitter3_1.default();
        this.rpc = { infuraId: opts === null || opts === void 0 ? void 0 : opts.infuraId, custom: opts === null || opts === void 0 ? void 0 : opts.rpc };
        this.signer = new jsonrpc_provider_1.JsonRpcProvider(new signer_connection_1.SignerConnection(opts));
        const chainId = this.signer.connection.chainId || (opts === null || opts === void 0 ? void 0 : opts.chainId) || 1;
        this.http = this.setHttpProvider(chainId);
        this.registerEventListeners();
    }
    get connected() {
        return this.signer.connection.connected;
    }
    get connector() {
        return this.signer.connection.connector;
    }
    get accounts() {
        return this.signer.connection.accounts;
    }
    get chainId() {
        return this.signer.connection.chainId;
    }
    get rpcUrl() {
        var _a;
        return ((_a = this.http) === null || _a === void 0 ? void 0 : _a.connection).url || "";
    }
    request(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            switch (args.method) {
                case "eth_requestAccounts":
                    yield this.connect();
                    return this.signer.connection.accounts;
                case "eth_accounts":
                    return this.signer.connection.accounts;
                case "eth_chainId":
                    return this.signer.connection.chainId;
                default:
                    break;
            }
            if (utils_1.signingMethods.includes(args.method)) {
                return this.signer.request(args);
            }
            if (typeof this.http === "undefined") {
                throw new Error(`Cannot request JSON-RPC method (${args.method}) without provided rpc url`);
            }
            return this.http.request(args);
        });
    }
    sendAsync(args, callback) {
        this.request(args)
            .then(response => callback(null, response))
            .catch(error => callback(error, undefined));
    }
    enable() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const accounts = yield this.request({ method: "eth_requestAccounts" });
            return accounts;
        });
    }
    connect() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.signer.connection.connected) {
                yield this.signer.connect();
            }
        });
    }
    disconnect() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.signer.connection.connected) {
                yield this.signer.disconnect();
            }
        });
    }
    on(event, listener) {
        this.events.on(event, listener);
    }
    once(event, listener) {
        this.events.once(event, listener);
    }
    removeListener(event, listener) {
        this.events.removeListener(event, listener);
    }
    off(event, listener) {
        this.events.off(event, listener);
    }
    get isWalletConnect() {
        return true;
    }
    registerEventListeners() {
        this.signer.connection.on("accountsChanged", accounts => {
            this.events.emit("accountsChanged", accounts);
        });
        this.signer.connection.on("chainChanged", chainId => {
            this.http = this.setHttpProvider(chainId);
            this.events.emit("chainChanged", chainId);
        });
        this.signer.on("disconnect", () => {
            this.events.emit("disconnect");
        });
    }
    setHttpProvider(chainId) {
        const rpcUrl = (0, utils_1.getRpcUrl)(chainId, this.rpc);
        if (typeof rpcUrl === "undefined")
            return undefined;
        const http = new jsonrpc_provider_1.JsonRpcProvider(new jsonrpc_http_connection_1.HttpConnection(rpcUrl));
        return http;
    }
}
exports.default = WalletConnectProvider;
//# sourceMappingURL=index.js.map