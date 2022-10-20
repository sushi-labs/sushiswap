"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpConnection = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const cross_fetch_1 = tslib_1.__importDefault(require("cross-fetch"));
const safe_json_1 = require("@walletconnect/safe-json");
const jsonrpc_utils_1 = require("@walletconnect/jsonrpc-utils");
const DEFAULT_HTTP_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
};
const DEFAULT_HTTP_METHOD = "POST";
const DEFAULT_FETCH_OPTS = {
    headers: DEFAULT_HTTP_HEADERS,
    method: DEFAULT_HTTP_METHOD,
};
class HttpConnection {
    constructor(url) {
        this.url = url;
        this.events = new events_1.EventEmitter();
        this.isAvailable = false;
        this.registering = false;
        if (!jsonrpc_utils_1.isHttpUrl(url)) {
            throw new Error(`Provided URL is not compatible with HTTP connection: ${url}`);
        }
        this.url = url;
    }
    get connected() {
        return this.isAvailable;
    }
    get connecting() {
        return this.registering;
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
    open(url = this.url) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.register(url);
        });
    }
    close() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAvailable) {
                throw new Error("Connection already closed");
            }
            this.onClose();
        });
    }
    send(payload, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAvailable) {
                yield this.register();
            }
            try {
                const body = safe_json_1.safeJsonStringify(payload);
                const res = yield cross_fetch_1.default(this.url, Object.assign(Object.assign({}, DEFAULT_FETCH_OPTS), { body }));
                const data = yield res.json();
                this.onPayload({ data });
            }
            catch (e) {
                this.onError(payload.id, e);
            }
        });
    }
    register(url = this.url) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!jsonrpc_utils_1.isHttpUrl(url)) {
                throw new Error(`Provided URL is not compatible with HTTP connection: ${url}`);
            }
            if (this.registering) {
                return new Promise((resolve, reject) => {
                    this.events.once("register_error", error => {
                        reject(error);
                    });
                    this.events.once("open", () => {
                        if (typeof this.isAvailable === "undefined") {
                            return reject(new Error("HTTP connection is missing or invalid"));
                        }
                        resolve();
                    });
                });
            }
            this.url = url;
            this.registering = true;
            try {
                const body = safe_json_1.safeJsonStringify({ id: 1, jsonrpc: "2.0", method: "test", params: [] });
                yield cross_fetch_1.default(url, Object.assign(Object.assign({}, DEFAULT_FETCH_OPTS), { body }));
                this.onOpen();
            }
            catch (e) {
                const error = this.parseError(e);
                this.events.emit("register_error", error);
                this.onClose();
                throw error;
            }
        });
    }
    onOpen() {
        this.isAvailable = true;
        this.registering = false;
        this.events.emit("open");
    }
    onClose() {
        this.isAvailable = false;
        this.registering = false;
        this.events.emit("close");
    }
    onPayload(e) {
        if (typeof e.data === "undefined")
            return;
        const payload = typeof e.data === "string" ? safe_json_1.safeJsonParse(e.data) : e.data;
        this.events.emit("payload", payload);
    }
    onError(id, e) {
        const error = this.parseError(e);
        const message = error.message || error.toString();
        const payload = jsonrpc_utils_1.formatJsonRpcError(id, message);
        this.events.emit("payload", payload);
    }
    parseError(e, url = this.url) {
        return jsonrpc_utils_1.parseConnectionError(e, url, "HTTP");
    }
}
exports.HttpConnection = HttpConnection;
exports.default = HttpConnection;
//# sourceMappingURL=http.js.map