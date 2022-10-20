import { EventEmitter } from "events";
import fetch from "cross-fetch";
import { safeJsonParse, safeJsonStringify } from "@walletconnect/safe-json";
import { formatJsonRpcError, isHttpUrl, parseConnectionError, } from "@walletconnect/jsonrpc-utils";
const DEFAULT_HTTP_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
};
const DEFAULT_HTTP_METHOD = "POST";
const DEFAULT_FETCH_OPTS = {
    headers: DEFAULT_HTTP_HEADERS,
    method: DEFAULT_HTTP_METHOD,
};
export class HttpConnection {
    constructor(url) {
        this.url = url;
        this.events = new EventEmitter();
        this.isAvailable = false;
        this.registering = false;
        if (!isHttpUrl(url)) {
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
    async open(url = this.url) {
        await this.register(url);
    }
    async close() {
        if (!this.isAvailable) {
            throw new Error("Connection already closed");
        }
        this.onClose();
    }
    async send(payload, context) {
        if (!this.isAvailable) {
            await this.register();
        }
        try {
            const body = safeJsonStringify(payload);
            const res = await fetch(this.url, Object.assign(Object.assign({}, DEFAULT_FETCH_OPTS), { body }));
            const data = await res.json();
            this.onPayload({ data });
        }
        catch (e) {
            this.onError(payload.id, e);
        }
    }
    async register(url = this.url) {
        if (!isHttpUrl(url)) {
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
            const body = safeJsonStringify({ id: 1, jsonrpc: "2.0", method: "test", params: [] });
            await fetch(url, Object.assign(Object.assign({}, DEFAULT_FETCH_OPTS), { body }));
            this.onOpen();
        }
        catch (e) {
            const error = this.parseError(e);
            this.events.emit("register_error", error);
            this.onClose();
            throw error;
        }
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
        const payload = typeof e.data === "string" ? safeJsonParse(e.data) : e.data;
        this.events.emit("payload", payload);
    }
    onError(id, e) {
        const error = this.parseError(e);
        const message = error.message || error.toString();
        const payload = formatJsonRpcError(id, message);
        this.events.emit("payload", payload);
    }
    parseError(e, url = this.url) {
        return parseConnectionError(e, url, "HTTP");
    }
}
export default HttpConnection;
//# sourceMappingURL=http.js.map