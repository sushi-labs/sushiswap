let encodeString;
if (globalThis.Buffer) {
    encodeString = function encodeStringWithBuffer(str) {
        return globalThis.Buffer.from(str, 'utf8');
    };
}
else {
    const textEncoder = new TextEncoder();
    encodeString = function encodeStringWithTextEncoder(str) {
        return textEncoder.encode(str);
    };
}
export { encodeString };
