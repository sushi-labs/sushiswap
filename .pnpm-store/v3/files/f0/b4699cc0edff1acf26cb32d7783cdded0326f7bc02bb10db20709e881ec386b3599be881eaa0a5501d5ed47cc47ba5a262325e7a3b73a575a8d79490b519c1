import EventEmitter from "eventemitter3";
import { JsonRpcProvider } from "@walletconnect/jsonrpc-provider";
import { HttpConnection } from "@walletconnect/jsonrpc-http-connection";
import { getRpcUrl, signingMethods } from "@walletconnect/utils";
import { SignerConnection } from "@walletconnect/signer-connection";
class WalletConnectProvider {
    constructor(opts) {
        this.events = new EventEmitter();
        this.rpc = { infuraId: opts === null || opts === void 0 ? void 0 : opts.infuraId, custom: opts === null || opts === void 0 ? void 0 : opts.rpc };
        this.signer = new JsonRpcProvider(new SignerConnection(opts));
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
    async request(args) {
        switch (args.method) {
            case "eth_requestAccounts":
                await this.connect();
                return this.signer.connection.accounts;
            case "eth_accounts":
                return this.signer.connection.accounts;
            case "eth_chainId":
                return this.signer.connection.chainId;
            default:
                break;
        }
        if (signingMethods.includes(args.method)) {
            return this.signer.request(args);
        }
        if (typeof this.http === "undefined") {
            throw new Error(`Cannot request JSON-RPC method (${args.method}) without provided rpc url`);
        }
        return this.http.request(args);
    }
    sendAsync(args, callback) {
        this.request(args)
            .then(response => callback(null, response))
            .catch(error => callback(error, undefined));
    }
    async enable() {
        const accounts = await this.request({ method: "eth_requestAccounts" });
        return accounts;
    }
    async connect() {
        if (!this.signer.connection.connected) {
            await this.signer.connect();
        }
    }
    async disconnect() {
        if (this.signer.connection.connected) {
            await this.signer.disconnect();
        }
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
        const rpcUrl = getRpcUrl(chainId, this.rpc);
        if (typeof rpcUrl === "undefined")
            return undefined;
        const http = new JsonRpcProvider(new HttpConnection(rpcUrl));
        return http;
    }
}
export default WalletConnectProvider;
//# sourceMappingURL=index.js.map