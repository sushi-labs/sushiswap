"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLWebSocketClient = void 0;
var types_1 = require("./types");
var _1 = require(".");
var CONNECTION_INIT = 'connection_init';
var CONNECTION_ACK = 'connection_ack';
var PING = 'ping';
var PONG = 'pong';
var SUBSCRIBE = 'subscribe';
var NEXT = 'next';
var ERROR = 'error';
var COMPLETE = 'complete';
var GraphQLWebSocketMessage = /** @class */ (function () {
    function GraphQLWebSocketMessage(type, payload, id) {
        this._type = type;
        this._payload = payload;
        this._id = id;
    }
    Object.defineProperty(GraphQLWebSocketMessage.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphQLWebSocketMessage.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphQLWebSocketMessage.prototype, "payload", {
        get: function () {
            return this._payload;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphQLWebSocketMessage.prototype, "text", {
        get: function () {
            var result = { type: this.type };
            if (this.id != null && this.id != undefined)
                result.id = this.id;
            if (this.payload != null && this.payload != undefined)
                result.payload = this.payload;
            return JSON.stringify(result);
        },
        enumerable: false,
        configurable: true
    });
    GraphQLWebSocketMessage.parse = function (data, f) {
        var _a = JSON.parse(data), type = _a.type, payload = _a.payload, id = _a.id;
        return new GraphQLWebSocketMessage(type, f(payload), id);
    };
    return GraphQLWebSocketMessage;
}());
var GraphQLWebSocketClient = /** @class */ (function () {
    function GraphQLWebSocketClient(socket, _a) {
        var _this = this;
        var onInit = _a.onInit, onAcknowledged = _a.onAcknowledged, onPing = _a.onPing, onPong = _a.onPong;
        this.socketState = { acknowledged: false, lastRequestId: 0, subscriptions: {} };
        this.socket = socket;
        socket.onopen = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        this.socketState.acknowledged = false;
                        this.socketState.subscriptions = {};
                        _b = (_a = socket).send;
                        _c = ConnectionInit;
                        if (!onInit) return [3 /*break*/, 2];
                        return [4 /*yield*/, onInit()];
                    case 1:
                        _d = _e.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _d = null;
                        _e.label = 3;
                    case 3:
                        _b.apply(_a, [_c.apply(void 0, [_d]).text]);
                        return [2 /*return*/];
                }
            });
        }); };
        socket.onclose = function (e) {
            _this.socketState.acknowledged = false;
            _this.socketState.subscriptions = {};
        };
        socket.onerror = function (e) {
            console.error(e);
        };
        socket.onmessage = function (e) {
            try {
                var message = parseMessage(e.data);
                switch (message.type) {
                    case CONNECTION_ACK: {
                        if (_this.socketState.acknowledged) {
                            console.warn('Duplicate CONNECTION_ACK message ignored');
                        }
                        else {
                            _this.socketState.acknowledged = true;
                            if (onAcknowledged)
                                onAcknowledged(message.payload);
                        }
                        return;
                    }
                    case PING: {
                        if (onPing)
                            onPing(message.payload).then(function (r) { return socket.send(Pong(r).text); });
                        else
                            socket.send(Pong(null).text);
                        return;
                    }
                    case PONG: {
                        if (onPong)
                            onPong(message.payload);
                        return;
                    }
                }
                if (!_this.socketState.acknowledged) {
                    // Web-socket connection not acknowledged
                    return;
                }
                if (message.id === undefined || message.id === null || !_this.socketState.subscriptions[message.id]) {
                    // No subscription identifer or subscription indentifier is not found
                    return;
                }
                var _a = _this.socketState.subscriptions[message.id], query = _a.query, variables = _a.variables, subscriber = _a.subscriber;
                switch (message.type) {
                    case NEXT: {
                        if (!message.payload.errors && message.payload.data) {
                            subscriber.next && subscriber.next(message.payload.data);
                        }
                        if (message.payload.errors) {
                            subscriber.error &&
                                subscriber.error(new types_1.ClientError(__assign(__assign({}, message.payload), { status: 200 }), { query: query, variables: variables }));
                        }
                        else {
                        }
                        return;
                    }
                    case ERROR: {
                        subscriber.error &&
                            subscriber.error(new types_1.ClientError({ errors: message.payload, status: 200 }, { query: query, variables: variables }));
                        return;
                    }
                    case COMPLETE: {
                        subscriber.complete && subscriber.complete();
                        delete _this.socketState.subscriptions[message.id];
                        return;
                    }
                }
            }
            catch (e) {
                // Unexpected errors while handling graphql-ws message
                console.error(e);
                socket.close(1006);
            }
            socket.close(4400, 'Unknown graphql-ws message.');
        };
    }
    GraphQLWebSocketClient.prototype.makeSubscribe = function (query, operationName, variables, subscriber) {
        var _this = this;
        var subscriptionId = (this.socketState.lastRequestId++).toString();
        this.socketState.subscriptions[subscriptionId] = { query: query, variables: variables, subscriber: subscriber };
        this.socket.send(Subscribe(subscriptionId, { query: query, operationName: operationName, variables: variables }).text);
        return function () {
            _this.socket.send(Complete(subscriptionId).text);
            delete _this.socketState.subscriptions[subscriptionId];
        };
    };
    GraphQLWebSocketClient.prototype.rawRequest = function (query, variables) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var result;
            _this.rawSubscribe(query, {
                next: function (data, extensions) { return (result = { data: data, extensions: extensions }); },
                error: reject,
                complete: function () { return resolve(result); },
            }, variables);
        });
    };
    GraphQLWebSocketClient.prototype.request = function (document, variables) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var result;
            _this.subscribe(document, {
                next: function (data) { return (result = data); },
                error: reject,
                complete: function () { return resolve(result); },
            }, variables);
        });
    };
    GraphQLWebSocketClient.prototype.subscribe = function (document, subscriber, variables) {
        var _a = _1.resolveRequestDocument(document), query = _a.query, operationName = _a.operationName;
        return this.makeSubscribe(query, operationName, variables, subscriber);
    };
    GraphQLWebSocketClient.prototype.rawSubscribe = function (query, subscriber, variables) {
        return this.makeSubscribe(query, undefined, variables, subscriber);
    };
    GraphQLWebSocketClient.prototype.ping = function (payload) {
        this.socket.send(Ping(payload).text);
    };
    GraphQLWebSocketClient.prototype.close = function () {
        this.socket.close(1000);
    };
    GraphQLWebSocketClient.PROTOCOL = 'graphql-transport-ws';
    return GraphQLWebSocketClient;
}());
exports.GraphQLWebSocketClient = GraphQLWebSocketClient;
// Helper functions
function parseMessage(data, f) {
    if (f === void 0) { f = function (a) { return a; }; }
    var m = GraphQLWebSocketMessage.parse(data, f);
    return m;
}
function ConnectionInit(payload) {
    return new GraphQLWebSocketMessage(CONNECTION_INIT, payload);
}
function Ping(payload) {
    return new GraphQLWebSocketMessage(PING, payload, undefined);
}
function Pong(payload) {
    return new GraphQLWebSocketMessage(PONG, payload, undefined);
}
function Subscribe(id, payload) {
    return new GraphQLWebSocketMessage(SUBSCRIBE, payload, id);
}
function Complete(id) {
    return new GraphQLWebSocketMessage(COMPLETE, undefined, id);
}
//# sourceMappingURL=graphql-ws.js.map