"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeString = void 0;
let encodeString;
exports.encodeString = encodeString;
if (globalThis.Buffer) {
    exports.encodeString = encodeString = function encodeStringWithBuffer(str) {
        return globalThis.Buffer.from(str, 'utf8');
    };
}
else {
    const textEncoder = new TextEncoder();
    exports.encodeString = encodeString = function encodeStringWithTextEncoder(str) {
        return textEncoder.encode(str);
    };
}
