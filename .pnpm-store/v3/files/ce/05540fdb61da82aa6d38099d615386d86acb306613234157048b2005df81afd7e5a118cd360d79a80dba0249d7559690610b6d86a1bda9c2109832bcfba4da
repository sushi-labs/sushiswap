"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEGACY_WS = exports.isPromiseLike = exports.isGraphQLUpload = exports.isBlob = void 0;
function isBlob(obj) {
    return typeof obj.arrayBuffer === 'function';
}
exports.isBlob = isBlob;
function isGraphQLUpload(upload) {
    return typeof upload.createReadStream === 'function';
}
exports.isGraphQLUpload = isGraphQLUpload;
function isPromiseLike(obj) {
    return typeof obj.then === 'function';
}
exports.isPromiseLike = isPromiseLike;
var LEGACY_WS;
(function (LEGACY_WS) {
    LEGACY_WS["CONNECTION_INIT"] = "connection_init";
    LEGACY_WS["CONNECTION_ACK"] = "connection_ack";
    LEGACY_WS["CONNECTION_ERROR"] = "connection_error";
    LEGACY_WS["CONNECTION_KEEP_ALIVE"] = "ka";
    LEGACY_WS["START"] = "start";
    LEGACY_WS["STOP"] = "stop";
    LEGACY_WS["CONNECTION_TERMINATE"] = "connection_terminate";
    LEGACY_WS["DATA"] = "data";
    LEGACY_WS["ERROR"] = "error";
    LEGACY_WS["COMPLETE"] = "complete";
})(LEGACY_WS = exports.LEGACY_WS || (exports.LEGACY_WS = {}));
