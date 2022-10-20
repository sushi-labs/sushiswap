import BN from "bn.js";
import * as encoding from "@walletconnect/encoding";
export function convertArrayBufferToBuffer(arrBuf) {
    return encoding.arrayToBuffer(new Uint8Array(arrBuf));
}
export function convertArrayBufferToUtf8(arrBuf) {
    return encoding.arrayToUtf8(new Uint8Array(arrBuf));
}
export function convertArrayBufferToHex(arrBuf, noPrefix) {
    return encoding.arrayToHex(new Uint8Array(arrBuf), !noPrefix);
}
export function convertArrayBufferToNumber(arrBuf) {
    return encoding.arrayToNumber(new Uint8Array(arrBuf));
}
export function concatArrayBuffers(...args) {
    return encoding.hexToArray(args.map(b => encoding.arrayToHex(new Uint8Array(b))).join("")).buffer;
}
export function convertBufferToArrayBuffer(buf) {
    return encoding.bufferToArray(buf).buffer;
}
export function convertBufferToUtf8(buf) {
    return encoding.bufferToUtf8(buf);
}
export function convertBufferToHex(buf, noPrefix) {
    return encoding.bufferToHex(buf, !noPrefix);
}
export function convertBufferToNumber(buf) {
    return encoding.bufferToNumber(buf);
}
export function concatBuffers(...args) {
    return encoding.concatBuffers(...args);
}
export function convertUtf8ToArrayBuffer(utf8) {
    return encoding.utf8ToArray(utf8).buffer;
}
export function convertUtf8ToBuffer(utf8) {
    return encoding.utf8ToBuffer(utf8);
}
export function convertUtf8ToHex(utf8, noPrefix) {
    return encoding.utf8ToHex(utf8, !noPrefix);
}
export function convertUtf8ToNumber(utf8) {
    return new BN(utf8, 10).toNumber();
}
export function convertHexToBuffer(hex) {
    return encoding.hexToBuffer(hex);
}
export function convertHexToArrayBuffer(hex) {
    return encoding.hexToArray(hex).buffer;
}
export function convertHexToUtf8(hex) {
    return encoding.hexToUtf8(hex);
}
export function convertHexToNumber(hex) {
    return new BN(encoding.removeHexPrefix(hex), "hex").toNumber();
}
export function convertNumberToBuffer(num) {
    return encoding.numberToBuffer(num);
}
export function convertNumberToArrayBuffer(num) {
    return encoding.numberToArray(num).buffer;
}
export function convertNumberToUtf8(num) {
    return new BN(num).toString();
}
export function convertNumberToHex(num, noPrefix) {
    const hex = encoding.removeHexPrefix(encoding.sanitizeHex(new BN(num).toString(16)));
    return noPrefix ? hex : encoding.addHexPrefix(hex);
}
//# sourceMappingURL=encoding.js.map