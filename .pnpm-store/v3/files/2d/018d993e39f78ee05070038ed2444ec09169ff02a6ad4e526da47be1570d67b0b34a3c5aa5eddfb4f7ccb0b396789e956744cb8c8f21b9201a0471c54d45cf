"use strict";
// Copyright (c) 2018-2022 Coinbase, Inc. <https://www.coinbase.com/>
// Licensed under the Apache License, version 2.0
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQrUrl = exports.getFavicon = exports.range = exports.isBigNumber = exports.ensureParsedJSONObject = exports.ensureBN = exports.ensureRegExpString = exports.ensureIntNumber = exports.ensureBuffer = exports.ensureAddressString = exports.ensureEvenLengthHexString = exports.ensureHexString = exports.isHexString = exports.prepend0x = exports.strip0x = exports.has0xPrefix = exports.hexStringFromIntNumber = exports.intNumberFromHexString = exports.bigIntStringFromBN = exports.hexStringFromBuffer = exports.hexStringToUint8Array = exports.uint8ArrayToHex = exports.randomBytesHex = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const qs_1 = require("qs");
const types_1 = require("./types");
const INT_STRING_REGEX = /^[0-9]*$/;
const HEXADECIMAL_STRING_REGEX = /^[a-f0-9]*$/;
/**
 * @param length number of bytes
 */
function randomBytesHex(length) {
    return uint8ArrayToHex(crypto.getRandomValues(new Uint8Array(length)));
}
exports.randomBytesHex = randomBytesHex;
function uint8ArrayToHex(value) {
    return [...value].map(b => b.toString(16).padStart(2, "0")).join("");
}
exports.uint8ArrayToHex = uint8ArrayToHex;
function hexStringToUint8Array(hexString) {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}
exports.hexStringToUint8Array = hexStringToUint8Array;
function hexStringFromBuffer(buf, includePrefix = false) {
    const hex = buf.toString("hex");
    return (0, types_1.HexString)(includePrefix ? "0x" + hex : hex);
}
exports.hexStringFromBuffer = hexStringFromBuffer;
function bigIntStringFromBN(bn) {
    return (0, types_1.BigIntString)(bn.toString(10));
}
exports.bigIntStringFromBN = bigIntStringFromBN;
function intNumberFromHexString(hex) {
    return (0, types_1.IntNumber)(new bn_js_1.default(ensureEvenLengthHexString(hex, false), 16).toNumber());
}
exports.intNumberFromHexString = intNumberFromHexString;
function hexStringFromIntNumber(num) {
    return (0, types_1.HexString)("0x" + new bn_js_1.default(num).toString(16));
}
exports.hexStringFromIntNumber = hexStringFromIntNumber;
function has0xPrefix(str) {
    return str.startsWith("0x") || str.startsWith("0X");
}
exports.has0xPrefix = has0xPrefix;
function strip0x(hex) {
    if (has0xPrefix(hex)) {
        return hex.slice(2);
    }
    return hex;
}
exports.strip0x = strip0x;
function prepend0x(hex) {
    if (has0xPrefix(hex)) {
        return "0x" + hex.slice(2);
    }
    return "0x" + hex;
}
exports.prepend0x = prepend0x;
function isHexString(hex) {
    if (typeof hex !== "string") {
        return false;
    }
    const s = strip0x(hex).toLowerCase();
    return HEXADECIMAL_STRING_REGEX.test(s);
}
exports.isHexString = isHexString;
function ensureHexString(hex, includePrefix = false) {
    if (typeof hex === "string") {
        const s = strip0x(hex).toLowerCase();
        if (HEXADECIMAL_STRING_REGEX.test(s)) {
            return (0, types_1.HexString)(includePrefix ? "0x" + s : s);
        }
    }
    throw new Error(`"${String(hex)}" is not a hexadecimal string`);
}
exports.ensureHexString = ensureHexString;
function ensureEvenLengthHexString(hex, includePrefix = false) {
    let h = ensureHexString(hex, false);
    if (h.length % 2 === 1) {
        h = (0, types_1.HexString)("0" + h);
    }
    return includePrefix ? (0, types_1.HexString)("0x" + h) : h;
}
exports.ensureEvenLengthHexString = ensureEvenLengthHexString;
function ensureAddressString(str) {
    if (typeof str === "string") {
        const s = strip0x(str).toLowerCase();
        if (isHexString(s) && s.length === 40) {
            return (0, types_1.AddressString)(prepend0x(s));
        }
    }
    throw new Error(`Invalid Ethereum address: ${String(str)}`);
}
exports.ensureAddressString = ensureAddressString;
function ensureBuffer(str) {
    if (Buffer.isBuffer(str)) {
        return str;
    }
    if (typeof str === "string") {
        if (isHexString(str)) {
            const s = ensureEvenLengthHexString(str, false);
            return Buffer.from(s, "hex");
        }
        else {
            return Buffer.from(str, "utf8");
        }
    }
    throw new Error(`Not binary data: ${String(str)}`);
}
exports.ensureBuffer = ensureBuffer;
function ensureIntNumber(num) {
    if (typeof num === "number" && Number.isInteger(num)) {
        return (0, types_1.IntNumber)(num);
    }
    if (typeof num === "string") {
        if (INT_STRING_REGEX.test(num)) {
            return (0, types_1.IntNumber)(Number(num));
        }
        if (isHexString(num)) {
            return (0, types_1.IntNumber)(new bn_js_1.default(ensureEvenLengthHexString(num, false), 16).toNumber());
        }
    }
    throw new Error(`Not an integer: ${String(num)}`);
}
exports.ensureIntNumber = ensureIntNumber;
function ensureRegExpString(regExp) {
    if (regExp instanceof RegExp) {
        return (0, types_1.RegExpString)(regExp.toString());
    }
    throw new Error(`Not a RegExp: ${String(regExp)}`);
}
exports.ensureRegExpString = ensureRegExpString;
function ensureBN(val) {
    if (val !== null && (bn_js_1.default.isBN(val) || isBigNumber(val))) {
        return new bn_js_1.default(val.toString(10), 10);
    }
    if (typeof val === "number") {
        return new bn_js_1.default(ensureIntNumber(val));
    }
    if (typeof val === "string") {
        if (INT_STRING_REGEX.test(val)) {
            return new bn_js_1.default(val, 10);
        }
        if (isHexString(val)) {
            return new bn_js_1.default(ensureEvenLengthHexString(val, false), 16);
        }
    }
    throw new Error(`Not an integer: ${String(val)}`);
}
exports.ensureBN = ensureBN;
function ensureParsedJSONObject(val) {
    if (typeof val === "string") {
        return JSON.parse(val);
    }
    if (typeof val === "object") {
        return val;
    }
    throw new Error(`Not a JSON string or an object: ${String(val)}`);
}
exports.ensureParsedJSONObject = ensureParsedJSONObject;
function isBigNumber(val) {
    if (val == null || typeof val.constructor !== "function") {
        return false;
    }
    const { constructor } = val;
    return (typeof constructor.config === "function" &&
        typeof constructor.EUCLID === "number");
}
exports.isBigNumber = isBigNumber;
function range(start, stop) {
    return Array.from({ length: stop - start }, (_, i) => start + i);
}
exports.range = range;
function getFavicon() {
    const el = document.querySelector('link[sizes="192x192"]') ||
        document.querySelector('link[sizes="180x180"]') ||
        document.querySelector('link[rel="icon"]') ||
        document.querySelector('link[rel="shortcut icon"]');
    const { protocol, host } = document.location;
    const href = el ? el.getAttribute("href") : null;
    if (!href || href.startsWith("javascript:")) {
        return null;
    }
    if (href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("data:")) {
        return href;
    }
    if (href.startsWith("//")) {
        return protocol + href;
    }
    return `${protocol}//${host}${href}`;
}
exports.getFavicon = getFavicon;
function createQrUrl(sessionId, sessionSecret, serverUrl, isParentConnection) {
    const sessionIdKey = isParentConnection ? "parent-id" : "id";
    const query = (0, qs_1.stringify)({
        [sessionIdKey]: sessionId,
        secret: sessionSecret,
        server: serverUrl,
        v: "1",
    });
    const qrUrl = `${serverUrl}/#/link?${query}`;
    return qrUrl;
}
exports.createQrUrl = createQrUrl;
