"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcProvider = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const utils_1 = require("@json-rpc-tools/utils");
const http_1 = require("./http");
const ws_1 = require("./ws");
const url_1 = require("./url");
class JsonRpcProvider extends utils_1.IJsonRpcProvider {
    constructor(connection) {
        super(connection);
        this.events = new events_1.EventEmitter();
        this.connection = this.setConnection(connection);
    }
    connect(connection = this.connection) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.open(connection);
        });
    }
    disconnect() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.close();
        });
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
    request(request, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.requestStrict(utils_1.formatJsonRpcRequest(request.method, request.params || []), context);
        });
    }
    requestStrict(request, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (!this.connection.connected) {
                    try {
                        yield this.open();
                    }
                    catch (e) {
                        reject(e.message);
                    }
                }
                this.events.on(`${request.id}`, response => {
                    if (utils_1.isJsonRpcError(response)) {
                        reject(response.error.message);
                    }
                    else {
                        resolve(response.result);
                    }
                });
                yield this.connection.send(request);
            }));
        });
    }
    setConnection(connection = this.connection) {
        return typeof connection === "string"
            ? url_1.isHttpUrl(connection)
                ? new http_1.HttpConnection(connection)
                : new ws_1.WsConnection(connection)
            : connection;
    }
    onPayload(payload) {
        this.events.emit("payload", payload);
        if (utils_1.isJsonRpcResponse(payload)) {
            this.events.emit(`${payload.id}`, payload);
        }
        else {
            this.events.emit("message", {
                type: payload.method,
                data: payload.params,
            });
        }
    }
    open(connection = this.connection) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.connection === connection && this.connection.connected)
                return;
            if (this.connection.connected)
                this.close();
            this.connection = this.setConnection();
            yield this.connection.open();
            this.connection.on("payload", (payload) => this.onPayload(payload));
            this.connection.on("close", () => this.events.emit("disconnect"));
            this.connection.on("error", () => this.events.emit("error"));
            this.events.emit("connect");
        });
    }
    close() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.connection.close();
            this.events.emit("disconnect");
        });
    }
}
exports.JsonRpcProvider = JsonRpcProvider;
exports.default = JsonRpcProvider;
//# sourceMappingURL=provider.js.map