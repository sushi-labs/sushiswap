"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignerConnection = void 0;
const tslib_1 = require("tslib");
const eventemitter3_1 = tslib_1.__importDefault(require("eventemitter3"));
const client_1 = tslib_1.__importDefault(require("@walletconnect/client"));
const qrcode_modal_1 = tslib_1.__importDefault(require("@walletconnect/qrcode-modal"));
const jsonrpc_types_1 = require("@walletconnect/jsonrpc-types");
const jsonrpc_utils_1 = require("@walletconnect/jsonrpc-utils");
class SignerConnection extends jsonrpc_types_1.IJsonRpcConnection {
    constructor(opts) {
        super();
        this.events = new eventemitter3_1.default();
        this.accounts = [];
        this.chainId = 1;
        this.pending = false;
        this.bridge = "https://bridge.walletconnect.org";
        this.qrcode = true;
        this.qrcodeModalOptions = undefined;
        this.opts = opts;
        this.chainId = (opts === null || opts === void 0 ? void 0 : opts.chainId) || this.chainId;
        this.wc = this.register(opts);
    }
    get connected() {
        return typeof this.wc !== "undefined" && this.wc.connected;
    }
    get connecting() {
        return this.pending;
    }
    get connector() {
        this.wc = this.register(this.opts);
        return this.wc;
    }
    on(event, listener) {
        this.events.on(event, listener);
    }
    once(event, listener) {
        this.events.once(event, listener);
    }
    off(event, listener) {
        this.events.off(event, listener);
    }
    removeListener(event, listener) {
        this.events.removeListener(event, listener);
    }
    open(chainId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.connected) {
                this.onOpen();
                return;
            }
            return new Promise((resolve, reject) => {
                this.on("error", err => {
                    reject(err);
                });
                this.on("open", () => {
                    resolve();
                });
                this.create(chainId);
            });
        });
    }
    close() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof this.wc === "undefined")
                return;
            if (this.wc.connected) {
                this.wc.killSession();
            }
            this.onClose();
        });
    }
    send(payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.wc = this.register(this.opts);
            if (!this.connected)
                yield this.open();
            this.sendPayload(payload)
                .then((res) => this.events.emit("payload", res))
                .catch(e => this.events.emit("payload", (0, jsonrpc_utils_1.formatJsonRpcError)(payload.id, e.message)));
        });
    }
    register(opts) {
        if (this.wc)
            return this.wc;
        this.opts = opts || this.opts;
        this.bridge = (opts === null || opts === void 0 ? void 0 : opts.connector)
            ? opts.connector.bridge
            : (opts === null || opts === void 0 ? void 0 : opts.bridge) || "https://bridge.walletconnect.org";
        this.qrcode = typeof (opts === null || opts === void 0 ? void 0 : opts.qrcode) === "undefined" || opts.qrcode !== false;
        this.chainId = typeof (opts === null || opts === void 0 ? void 0 : opts.chainId) !== "undefined" ? opts.chainId : this.chainId;
        this.qrcodeModalOptions = opts === null || opts === void 0 ? void 0 : opts.qrcodeModalOptions;
        const connectorOpts = {
            bridge: this.bridge,
            qrcodeModal: this.qrcode ? qrcode_modal_1.default : undefined,
            qrcodeModalOptions: this.qrcodeModalOptions,
            storageId: opts === null || opts === void 0 ? void 0 : opts.storageId,
            signingMethods: opts === null || opts === void 0 ? void 0 : opts.signingMethods,
            clientMeta: opts === null || opts === void 0 ? void 0 : opts.clientMeta,
        };
        this.wc =
            typeof (opts === null || opts === void 0 ? void 0 : opts.connector) !== "undefined" ? opts.connector : new client_1.default(connectorOpts);
        if (typeof this.wc === "undefined") {
            throw new Error("Failed to register WalletConnect connector");
        }
        if (this.wc.accounts.length) {
            this.accounts = this.wc.accounts;
        }
        if (this.wc.chainId) {
            this.chainId = this.wc.chainId;
        }
        this.registerConnectorEvents();
        return this.wc;
    }
    onOpen(wc) {
        this.pending = false;
        if (wc) {
            this.wc = wc;
        }
        this.events.emit("open");
    }
    onClose() {
        this.pending = false;
        if (this.wc) {
            this.wc = undefined;
        }
        this.events.emit("close");
    }
    onError(payload, message = "Failed or Rejected Request", code = -32000) {
        const errorPayload = {
            id: payload.id,
            jsonrpc: payload.jsonrpc,
            error: { code, message },
        };
        this.events.emit("payload", errorPayload);
        return errorPayload;
    }
    create(chainId) {
        this.wc = this.register(this.opts);
        this.chainId = chainId || this.chainId;
        if (this.connected || this.pending)
            return;
        this.pending = true;
        this.registerConnectorEvents();
        this.wc
            .createSession({ chainId: this.chainId })
            .then(() => this.events.emit("created"))
            .catch((e) => this.events.emit("error", e));
    }
    registerConnectorEvents() {
        this.wc = this.register(this.opts);
        this.wc.on("connect", (err) => {
            var _a, _b;
            if (err) {
                this.events.emit("error", err);
                return;
            }
            this.accounts = ((_a = this.wc) === null || _a === void 0 ? void 0 : _a.accounts) || [];
            this.chainId = ((_b = this.wc) === null || _b === void 0 ? void 0 : _b.chainId) || this.chainId;
            this.onOpen();
        });
        this.wc.on("disconnect", (err) => {
            if (err) {
                this.events.emit("error", err);
                return;
            }
            this.onClose();
        });
        this.wc.on("modal_closed", () => {
            this.events.emit("error", new Error("User closed modal"));
        });
        this.wc.on("session_update", (error, payload) => {
            const { accounts, chainId } = payload.params[0];
            if (!this.accounts || (accounts && this.accounts !== accounts)) {
                this.accounts = accounts;
                this.events.emit("accountsChanged", accounts);
            }
            if (!this.chainId || (chainId && this.chainId !== chainId)) {
                this.chainId = chainId;
                this.events.emit("chainChanged", chainId);
            }
        });
    }
    sendPayload(payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.wc = this.register(this.opts);
            try {
                const response = yield this.wc.unsafeSend(payload);
                return this.sanitizeResponse(response);
            }
            catch (error) {
                return this.onError(payload, error.message);
            }
        });
    }
    sanitizeResponse(response) {
        return typeof response.error !== "undefined" &&
            typeof response.error.code === "undefined"
            ? (0, jsonrpc_utils_1.formatJsonRpcError)(response.id, response.error.message)
            : response;
    }
}
exports.SignerConnection = SignerConnection;
exports.default = SignerConnection;
//# sourceMappingURL=index.js.map