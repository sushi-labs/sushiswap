"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcProvider = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const jsonrpc_utils_1 = require("@walletconnect/jsonrpc-utils");
class JsonRpcProvider extends jsonrpc_utils_1.IJsonRpcProvider {
    constructor(connection) {
        super(connection);
        this.events = new events_1.EventEmitter();
        this.hasRegisteredEventListeners = false;
        this.connection = this.setConnection(connection);
        if (this.connection.connected) {
            this.registerEventListeners();
        }
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
            return this.requestStrict(jsonrpc_utils_1.formatJsonRpcRequest(request.method, request.params || []), context);
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
                        reject(e);
                    }
                }
                this.events.on(`${request.id}`, response => {
                    if (jsonrpc_utils_1.isJsonRpcError(response)) {
                        reject(response.error);
                    }
                    else {
                        resolve(response.result);
                    }
                });
                try {
                    yield this.connection.send(request, context);
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    }
    setConnection(connection = this.connection) {
        return connection;
    }
    onPayload(payload) {
        this.events.emit("payload", payload);
        if (jsonrpc_utils_1.isJsonRpcResponse(payload)) {
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
            if (typeof connection === "string") {
                yield this.connection.open(connection);
                connection = this.connection;
            }
            this.connection = this.setConnection(connection);
            yield this.connection.open();
            this.registerEventListeners();
            this.events.emit("connect");
        });
    }
    close() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.connection.close();
        });
    }
    registerEventListeners() {
        if (this.hasRegisteredEventListeners)
            return;
        this.connection.on("payload", (payload) => this.onPayload(payload));
        this.connection.on("close", () => this.events.emit("disconnect"));
        this.connection.on("error", (error) => this.events.emit("error", error));
        this.hasRegisteredEventListeners = true;
    }
}
exports.JsonRpcProvider = JsonRpcProvider;
exports.default = JsonRpcProvider;
//# sourceMappingURL=provider.js.map