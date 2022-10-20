import * as encoding from "@walletconnect/encoding";
import { signingMethods, reservedEvents } from "./constants";
export function isEmptyString(value) {
    return value === "" || (typeof value === "string" && value.trim() === "");
}
export function isEmptyArray(array) {
    return !(array && array.length);
}
export function isBuffer(val) {
    return encoding.isBuffer(val);
}
export function isTypedArray(val) {
    return encoding.isTypedArray(val);
}
export function isArrayBuffer(val) {
    return encoding.isArrayBuffer(val);
}
export function getType(val) {
    return encoding.getType(val);
}
export function getEncoding(val) {
    return encoding.getEncoding(val);
}
export function isHexString(value, length) {
    return encoding.isHexString(value, length);
}
export function isJsonRpcSubscription(object) {
    return typeof object.params === "object";
}
export function isJsonRpcRequest(object) {
    return typeof object.method !== "undefined";
}
export function isJsonRpcResponseSuccess(object) {
    return typeof object.result !== "undefined";
}
export function isJsonRpcResponseError(object) {
    return typeof object.error !== "undefined";
}
export function isInternalEvent(object) {
    return typeof object.event !== "undefined";
}
export function isReservedEvent(event) {
    return reservedEvents.includes(event) || event.startsWith("wc_");
}
export function isSilentPayload(request) {
    if (request.method.startsWith("wc_")) {
        return true;
    }
    if (signingMethods.includes(request.method)) {
        return false;
    }
    return true;
}
//# sourceMappingURL=validators.js.map