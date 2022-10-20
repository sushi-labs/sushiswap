export function isJsonRpcPayload(payload) {
    return (typeof payload === "object" &&
        "id" in payload &&
        "jsonrpc" in payload &&
        payload.jsonrpc === "2.0");
}
export function isJsonRpcRequest(payload) {
    return isJsonRpcPayload(payload) && "method" in payload;
}
export function isJsonRpcResponse(payload) {
    return isJsonRpcPayload(payload) && (isJsonRpcResult(payload) || isJsonRpcError(payload));
}
export function isJsonRpcResult(payload) {
    return "result" in payload;
}
export function isJsonRpcError(payload) {
    return "error" in payload;
}
export function isJsonRpcValidationInvalid(validation) {
    return "error" in validation && validation.valid === false;
}
//# sourceMappingURL=validators.js.map