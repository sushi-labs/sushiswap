import _isTypedArray from "is-typedarray";
import typedArrayToBuffer from "typedarray-to-buffer";
const ENC_HEX = "hex";
const ENC_UTF8 = "utf8";
const ENC_BIN = "binary";
const TYPE_BUFFER = "buffer";
const TYPE_ARRAY = "array";
const TYPE_TYPED_ARRAY = "typed-array";
const TYPE_ARRAY_BUFFER = "array-buffer";
const STRING_ZERO = "0";
export function bufferToArray(buf) {
    return new Uint8Array(buf);
}
export function bufferToHex(buf, prefixed = false) {
    const hex = buf.toString(ENC_HEX);
    return prefixed ? addHexPrefix(hex) : hex;
}
export function bufferToUtf8(buf) {
    return buf.toString(ENC_UTF8);
}
export function bufferToNumber(buf) {
    return buf.readUIntBE(0, buf.length);
}
export function bufferToBinary(buf) {
    return arrayToBinary(bufferToArray(buf));
}
export function arrayToBuffer(arr) {
    return typedArrayToBuffer(arr);
}
export function arrayToHex(arr, prefixed = false) {
    return bufferToHex(arrayToBuffer(arr), prefixed);
}
export function arrayToUtf8(arr) {
    return bufferToUtf8(arrayToBuffer(arr));
}
export function arrayToNumber(arr) {
    return bufferToNumber(arrayToBuffer(arr));
}
export function arrayToBinary(arr) {
    return Array.from(arr)
        .map(numberToBinary)
        .join("");
}
export function hexToBuffer(hex) {
    return Buffer.from(removeHexPrefix(hex), ENC_HEX);
}
export function hexToArray(hex) {
    return bufferToArray(hexToBuffer(hex));
}
export function hexToUtf8(hex) {
    return bufferToUtf8(hexToBuffer(hex));
}
export function hexToNumber(hex) {
    return arrayToNumber(hexToArray(hex));
}
export function hexToBinary(hex) {
    return arrayToBinary(hexToArray(hex));
}
export function utf8ToBuffer(utf8) {
    return Buffer.from(utf8, ENC_UTF8);
}
export function utf8ToArray(utf8) {
    return bufferToArray(utf8ToBuffer(utf8));
}
export function utf8ToHex(utf8, prefixed = false) {
    return bufferToHex(utf8ToBuffer(utf8), prefixed);
}
export function utf8ToNumber(utf8) {
    const num = parseInt(utf8, 10);
    assert(isDefined(num), "Number can only safely store up to 53 bits");
    return num;
}
export function utf8ToBinary(utf8) {
    return arrayToBinary(utf8ToArray(utf8));
}
export function numberToBuffer(num) {
    return binaryToBuffer(numberToBinary(num));
}
export function numberToArray(num) {
    return binaryToArray(numberToBinary(num));
}
export function numberToHex(num, prefixed) {
    return binaryToHex(numberToBinary(num), prefixed);
}
export function numberToUtf8(num) {
    return `${num}`;
}
export function numberToBinary(num) {
    const bin = (num >>> 0).toString(2);
    return sanitizeBytes(bin);
}
export function binaryToBuffer(bin) {
    return arrayToBuffer(binaryToArray(bin));
}
export function binaryToArray(bin) {
    return new Uint8Array(splitBytes(bin).map(x => parseInt(x, 2)));
}
export function binaryToHex(bin, prefixed) {
    return arrayToHex(binaryToArray(bin), prefixed);
}
export function binaryToUtf8(bin) {
    return arrayToUtf8(binaryToArray(bin));
}
export function binaryToNumber(bin) {
    return arrayToNumber(binaryToArray(bin));
}
export function isBinaryString(str) {
    if (typeof str !== "string" || !new RegExp(/^[01]+$/).test(str)) {
        return false;
    }
    if (str.length % 8 !== 0) {
        return false;
    }
    return true;
}
export function isHexString(str, length) {
    if (typeof str !== "string" || !str.match(/^0x[0-9A-Fa-f]*$/)) {
        return false;
    }
    if (length && str.length !== 2 + 2 * length) {
        return false;
    }
    return true;
}
export function isBuffer(val) {
    return Buffer.isBuffer(val);
}
export function isTypedArray(val) {
    return _isTypedArray.strict(val) && !isBuffer(val);
}
export function isArrayBuffer(val) {
    return (!isTypedArray(val) &&
        !isBuffer(val) &&
        typeof val.byteLength !== "undefined");
}
export function getType(val) {
    if (isBuffer(val)) {
        return TYPE_BUFFER;
    }
    else if (isTypedArray(val)) {
        return TYPE_TYPED_ARRAY;
    }
    else if (isArrayBuffer(val)) {
        return TYPE_ARRAY_BUFFER;
    }
    else if (Array.isArray(val)) {
        return TYPE_ARRAY;
    }
    else {
        return typeof val;
    }
}
export function getEncoding(str) {
    if (isBinaryString(str)) {
        return ENC_BIN;
    }
    if (isHexString(str)) {
        return ENC_HEX;
    }
    return ENC_UTF8;
}
export function concatBuffers(...args) {
    const result = Buffer.concat(args);
    return result;
}
export function concatArrays(...args) {
    let result = [];
    args.forEach(arg => (result = result.concat(Array.from(arg))));
    return new Uint8Array([...result]);
}
export function trimLeft(data, length) {
    const diff = data.length - length;
    if (diff > 0) {
        data = data.slice(diff);
    }
    return data;
}
export function trimRight(data, length) {
    return data.slice(0, length);
}
export function calcByteLength(length, byteSize = 8) {
    const remainder = length % byteSize;
    return remainder
        ? ((length - remainder) / byteSize) * byteSize + byteSize
        : length;
}
export function splitBytes(str, byteSize = 8) {
    const bytes = sanitizeBytes(str).match(new RegExp(`.{${byteSize}}`, "gi"));
    return Array.from(bytes || []);
}
export function swapBytes(str) {
    return splitBytes(str)
        .map(reverseString)
        .join("");
}
export function swapHex(str) {
    return binaryToHex(swapBytes(hexToBinary(str)));
}
export function sanitizeBytes(str, byteSize = 8, padding = STRING_ZERO) {
    return padLeft(str, calcByteLength(str.length, byteSize), padding);
}
export function padLeft(str, length, padding = STRING_ZERO) {
    return padString(str, length, true, padding);
}
export function padRight(str, length, padding = STRING_ZERO) {
    return padString(str, length, false, padding);
}
export function removeHexPrefix(hex) {
    return hex.replace(/^0x/, "");
}
export function addHexPrefix(hex) {
    return hex.startsWith("0x") ? hex : `0x${hex}`;
}
export function sanitizeHex(hex) {
    hex = removeHexPrefix(hex);
    hex = sanitizeBytes(hex, 2);
    if (hex) {
        hex = addHexPrefix(hex);
    }
    return hex;
}
export function removeHexLeadingZeros(hex) {
    const prefixed = hex.startsWith("0x");
    hex = removeHexPrefix(hex);
    hex = hex.startsWith(STRING_ZERO) ? hex.substring(1) : hex;
    return prefixed ? addHexPrefix(hex) : hex;
}
function isUndefined(value) {
    return typeof value === "undefined";
}
function isDefined(value) {
    return !isUndefined(value);
}
function assert(assertion, errorMessage) {
    if (!assertion) {
        throw new Error(errorMessage);
    }
}
function reverseString(str) {
    return str
        .split("")
        .reverse()
        .join("");
}
function padString(str, length, left, padding = STRING_ZERO) {
    const diff = length - str.length;
    let result = str;
    if (diff > 0) {
        const pad = padding.repeat(diff);
        result = left ? pad + str : str + pad;
    }
    return result;
}
//# sourceMappingURL=index.js.map