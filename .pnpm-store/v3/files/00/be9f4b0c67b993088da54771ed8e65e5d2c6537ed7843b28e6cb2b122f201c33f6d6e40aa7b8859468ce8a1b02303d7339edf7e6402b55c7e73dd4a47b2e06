"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConstantTime = exports.assert = void 0;
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}
exports.assert = assert;
function isConstantTime(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    let res = 0;
    for (let i = 0; i < arr1.length; i++) {
        res |= arr1[i] ^ arr2[i];
    }
    return res === 0;
}
exports.isConstantTime = isConstantTime;
//# sourceMappingURL=validators.js.map