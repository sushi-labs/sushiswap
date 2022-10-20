"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpConnection = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const axios_1 = tslib_1.__importDefault(require("axios"));
const utils_1 = require("@json-rpc-tools/utils");
const safe_json_utils_1 = require("safe-json-utils");
const url_1 = require("./url");
class HttpConnection {
    constructor(url) {
        this.url = url;
        this.events = new events_1.EventEmitter();
        this.registering = false;
        if (!url_1.isHttpUrl(url)) {
            throw new Error(`Provided URL is not compatible with HTTP connection: ${url}`);
        }
        this.url = url;
    }
    get connected() {
        return typeof this.api !== "undefined";
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
            this.api = yield this.register(url);
        });
    }
    close() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.onClose();
        });
    }
    send(payload, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof this.api === "undefined") {
                this.api = yield this.register();
            }
            this.api
                .post("/", payload)
                .then(res => this.onPayload(res))
                .catch(err => this.onError(payload.id, err));
        });
    }
    register(url = this.url) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!url_1.isHttpUrl(url)) {
                throw new Error(`Provided URL is not compatible with HTTP connection: ${url}`);
            }
            if (this.registering) {
                return new Promise((resolve, reject) => {
                    this.events.once("open", () => {
                        if (typeof this.api === "undefined") {
                            return reject(new Error("HTTP connection is missing or invalid"));
                        }
                        resolve(this.api);
                    });
                });
            }
            this.url = url;
            this.registering = true;
            const api = axios_1.default.create({
                baseURL: url,
                timeout: 30000,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            try {
                yield api.post("/", { id: 1, jsonrpc: "2.0", method: "test", params: [] });
                this.onOpen(api);
            }
            catch (e) {
                this.onClose();
                throw new Error(`Unavailable HTTP RPC url at ${url}`);
            }
            return api;
        });
    }
    onOpen(api) {
        this.api = api;
        this.registering = false;
        this.events.emit("open");
    }
    onClose() {
        this.api = undefined;
        this.events.emit("close");
    }
    onPayload(e) {
        if (typeof e.data === "undefined")
            return;
        const payload = typeof e.data === "string" ? safe_json_utils_1.safeJsonParse(e.data) : e.data;
        this.events.emit("payload", payload);
    }
    onError(id, e) {
        const message = e.message || e.toString();
        const payload = utils_1.formatJsonRpcError(id, message);
        this.events.emit("payload", payload);
    }
}
exports.HttpConnection = HttpConnection;
//# sourceMappingURL=http.js.map