import { keccak_256 } from "js-sha3";
import { removeHexPrefix, addHexPrefix } from "@walletconnect/encoding";
import { convertUtf8ToHex, convertNumberToHex, convertUtf8ToBuffer } from "./encoding";
import { sanitizeHex, removeHexLeadingZeros } from "./misc";
import { isEmptyArray, isHexString, isEmptyString } from "./validators";
export function toChecksumAddress(address) {
    address = removeHexPrefix(address.toLowerCase());
    const hash = removeHexPrefix(keccak_256(convertUtf8ToBuffer(address)));
    let checksum = "";
    for (let i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) > 7) {
            checksum += address[i].toUpperCase();
        }
        else {
            checksum += address[i];
        }
    }
    return addHexPrefix(checksum);
}
export const isValidAddress = (address) => {
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
export function parsePersonalSign(params) {
    if (!isEmptyArray(params) && !isHexString(params[0])) {
        params[0] = convertUtf8ToHex(params[0]);
    }
    return params;
}
export function parseTransactionData(txData) {
    if (typeof txData.type !== "undefined" && txData.type !== "0")
        return txData;
    if (typeof txData.from === "undefined" || !isValidAddress(txData.from)) {
        throw new Error(`Transaction object must include a valid 'from' value.`);
    }
    function parseHexValues(value) {
        let result = value;
        if (typeof value === "number" || (typeof value === "string" && !isEmptyString(value))) {
            if (!isHexString(value)) {
                result = convertNumberToHex(value);
            }
            else if (typeof value === "string") {
                result = sanitizeHex(value);
            }
        }
        if (typeof result === "string") {
            result = removeHexLeadingZeros(result);
        }
        return result;
    }
    const txDataRPC = {
        from: sanitizeHex(txData.from),
        to: typeof txData.to === "undefined" ? undefined : sanitizeHex(txData.to),
        gasPrice: typeof txData.gasPrice === "undefined" ? "" : parseHexValues(txData.gasPrice),
        gas: typeof txData.gas === "undefined"
            ? typeof txData.gasLimit === "undefined"
                ? ""
                : parseHexValues(txData.gasLimit)
            : parseHexValues(txData.gas),
        value: typeof txData.value === "undefined" ? "" : parseHexValues(txData.value),
        nonce: typeof txData.nonce === "undefined" ? "" : parseHexValues(txData.nonce),
        data: typeof txData.data === "undefined" ? "" : sanitizeHex(txData.data) || "0x",
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
//# sourceMappingURL=ethereum.js.map