"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsConnection = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const safe_json_utils_1 = require("safe-json-utils");
const utils_1 = require("@json-rpc-tools/utils");
const url_1 = require("./url");
const WS = typeof global.WebSocket !== "undefined" ? global.WebSocket : require("ws");
class WsConnection {
    constructor(url) {
        this.url = url;
        this.events = new events_1.EventEmitter();
        this.registering = false;
        if (!url_1.isWsUrl(url)) {
            throw new Error(`Provided URL is not compatible with WebSocket connection: ${url}`);
        }
        this.url = url;
    }
    get connected() {
        return typeof this.socket !== "undefined";
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
            this.socket = yield this.register(url);
        });
    }
    close() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof this.socket === "undefined") {
                throw new Error("Already disconnected");
            }
            this.socket.close();
            this.onClose();
        });
    }
    send(payload, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof this.socket === "undefined") {
                this.socket = yield this.register();
            }
            this.socket.send(safe_json_utils_1.safeJsonStringify(payload));
        });
    }
    register(url = this.url) {
        if (!url_1.isWsUrl(url)) {
            throw new Error(`Provided URL is not compatible with WebSocket connection: ${url}`);
        }
        if (this.registering) {
            return new Promise((resolve, reject) => {
                this.events.once("open", () => {
                    if (typeof this.socket === "undefined") {
                        return reject(new Error("WebSocket connection is missing or invalid"));
                    }
                    resolve(this.socket);
                });
            });
        }
        this.url = url;
        this.registering = true;
        return new Promise((resolve, reject) => {
            const opts = !utils_1.isReactNative() ? { rejectUnauthorized: !url_1.isLocalhostUrl(url) } : undefined;
            const socket = new WS(url, [], opts);
            socket.onopen = () => {
                this.onOpen(socket);
                resolve(socket);
            };
            socket.onerror = (event) => {
                this.events.emit("error", event);
                reject(event);
            };
        });
    }
    onOpen(socket) {
        socket.onmessage = (event) => this.onPayload(event);
        socket.onclose = () => this.onClose();
        this.socket = socket;
        this.registering = false;
        this.events.emit("open");
    }
    onClose() {
        this.socket = undefined;
        this.events.emit("close");
    }
    onPayload(e) {
        if (typeof e.data === "undefined")
            return;
        const payload = typeof e.data === "string" ? safe_json_utils_1.safeJsonParse(e.data) : e.data;
        this.events.emit("payload", payload);
    }
}
exports.WsConnection = WsConnection;
//# sourceMappingURL=ws.js.map