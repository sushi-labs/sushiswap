"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTransactionData = exports.parsePersonalSign = exports.isValidAddress = exports.toChecksumAddress = void 0;
const js_sha3_1 = require("js-sha3");
const encoding_1 = require("@walletconnect/encoding");
const encoding_2 = require("./encoding");
const misc_1 = require("./misc");
const validators_1 = require("./validators");
function toChecksumAddress(address) {
    address = (0, encoding_1.removeHexPrefix)(address.toLowerCase());
    const hash = (0, encoding_1.removeHexPrefix)((0, js_sha3_1.keccak_256)((0, encoding_2.convertUtf8ToBuffer)(address)));
    let checksum = "";
    for (let i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) > 7) {
            checksum += address[i].toUpperCase();
        }
        else {
            checksum += address[i];
        }
    }
    return (0, encoding_1.addHexPrefix)(checksum);
}
exports.toChecksumAddress = toChecksumAddress;
const isValidAddress = (address) => {
    if (!address) {
        return false;
    }
    else if (address.toLowerCase().substring(0, 2) !== "0x") {
        return false;
    }
    else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        return false;
    }
    else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        return true;
    }
    else {
        return address === toChecksumAddress(address);
    }
};
exports.isValidAddress = isValidAddress;
function parsePersonalSign(params) {
    if (!(0, validators_1.isEmptyArray)(params) && !(0, validators_1.isHexString)(params[0])) {
        params[0] = (0, encoding_2.convertUtf8ToHex)(params[0]);
    }
    return params;
}
exports.parsePersonalSign = parsePersonalSign;
function parseTransactionData(txData) {
    if (typeof txData.type !== "undefined" && txData.type !== "0")
        return txData;
    if (typeof txData.from === "undefined" || !(0, exports.isValidAddress)(txData.from)) {
        throw new Error(`Transaction object must include a valid 'from' value.`);
    }
    function parseHexValues(value) {
        let result = value;
        if (typeof value === "number" || (typeof value === "string" && !(0, validators_1.isEmptyString)(value))) {
            if (!(0, validators_1.isHexString)(value)) {
                result = (0, encoding_2.convertNumberToHex)(value);
            }
            else if (typeof value === "string") {
                result = (0, misc_1.sanitizeHex)(value);
            }
        }
        if (typeof result === "string") {
            result = (0, misc_1.removeHexLeadingZeros)(result);
        }
        return result;
    }
    const txDataRPC = {
        from: (0, misc_1.sanitizeHex)(txData.from),
        to: typeof txData.to === "undefined" ? undefined : (0, misc_1.sanitizeHex)(txData.to),
        gasPrice: typeof txData.gasPrice === "undefined" ? "" : parseHexValues(txData.gasPrice),
        gas: typeof txData.gas === "undefined"
            ? typeof txData.gasLimit === "undefined"
                ? ""
                : parseHexValues(txData.gasLimit)
            : parseHexValues(txData.gas),
        value: typeof txData.value === "undefined" ? "" : parseHexValues(txData.value),
        nonce: typeof txData.nonce === "undefined" ? "" : parseHexValues(txData.nonce),
        data: typeof txData.data === "undefined" ? "" : (0, misc_1.sanitizeHex)(txData.data) || "0x",
    };
    const prunable = ["gasPrice", "gas", "value", "nonce"];
    Object.keys(txDataRPC).forEach((key) => {
        if ((typeof txDataRPC[key] === "undefined" ||
            (typeof txDataRPC[key] === "string" && !txDataRPC[key].trim().length)) &&
            prunable.includes(key)) {
            delete txDataRPC[key];
        }
    });
    return txDataRPC;
}
exports.parseTransactionData = parseTransactionData;
//# sourceMappingURL=ethereum.js.map