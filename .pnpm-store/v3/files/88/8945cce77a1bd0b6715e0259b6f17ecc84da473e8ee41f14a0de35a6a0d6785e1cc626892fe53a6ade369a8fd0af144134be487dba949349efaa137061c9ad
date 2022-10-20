import { memoize1 } from '@graphql-tools/utils';
export function isBlob(obj) {
    return typeof obj.arrayBuffer === 'function';
}
export function isGraphQLUpload(upload) {
    return typeof upload.createReadStream === 'function';
}
export function isPromiseLike(obj) {
    return typeof obj.then === 'function';
}
export const isLiveQueryOperationDefinitionNode = memoize1(function isLiveQueryOperationDefinitionNode(node) {
    var _a;
    return (_a = node.directives) === null || _a === void 0 ? void 0 : _a.some(directive => directive.name.value === 'live');
});
export var LEGACY_WS;
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
})(LEGACY_WS || (LEGACY_WS = {}));
