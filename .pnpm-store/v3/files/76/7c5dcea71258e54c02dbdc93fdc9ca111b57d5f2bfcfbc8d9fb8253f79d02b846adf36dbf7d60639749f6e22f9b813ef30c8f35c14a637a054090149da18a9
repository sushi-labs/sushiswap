import * as crypto from "@walletconnect/crypto";
import * as encoding from "@walletconnect/encoding";
import { convertArrayBufferToBuffer, convertBufferToArrayBuffer } from "@walletconnect/utils";
export async function generateKey(length) {
    const _length = (length || 256) / 8;
    const bytes = crypto.randomBytes(_length);
    const result = convertBufferToArrayBuffer(encoding.arrayToBuffer(bytes));
    return result;
}
export async function verifyHmac(payload, key) {
    const cipherText = encoding.hexToArray(payload.data);
    const iv = encoding.hexToArray(payload.iv);
    const hmac = encoding.hexToArray(payload.hmac);
    const hmacHex = encoding.arrayToHex(hmac, false);
    const unsigned = encoding.concatArrays(cipherText, iv);
    const chmac = await crypto.hmacSha256Sign(key, unsigned);
    const chmacHex = encoding.arrayToHex(chmac, false);
    if (encoding.removeHexPrefix(hmacHex) === encoding.removeHexPrefix(chmacHex)) {
        return true;
    }
    return false;
}
export async function encrypt(data, key, providedIv) {
    const _key = encoding.bufferToArray(convertArrayBufferToBuffer(key));
    const ivArrayBuffer = providedIv || (await generateKey(128));
    const iv = encoding.bufferToArray(convertArrayBufferToBuffer(ivArrayBuffer));
    const ivHex = encoding.arrayToHex(iv, false);
    const contentString = JSON.stringify(data);
    const content = encoding.utf8ToArray(contentString);
    const cipherText = await crypto.aesCbcEncrypt(iv, _key, content);
    const cipherTextHex = encoding.arrayToHex(cipherText, false);
    const unsigned = encoding.concatArrays(cipherText, iv);
    const hmac = await crypto.hmacSha256Sign(_key, unsigned);
    const hmacHex = encoding.arrayToHex(hmac, false);
    return {
        data: cipherTextHex,
        hmac: hmacHex,
        iv: ivHex,
    };
}
export async function decrypt(payload, key) {
    const _key = encoding.bufferToArray(convertArrayBufferToBuffer(key));
    if (!_key) {
        throw new Error("Missing key: required for decryption");
    }
    const verified = await verifyHmac(payload, _key);
    if (!verified) {
        return null;
    }
    const cipherText = encoding.hexToArray(payload.data);
    const iv = encoding.hexToArray(payload.iv);
    const buffer = await crypto.aesCbcDecrypt(iv, _key, cipherText);
    const utf8 = encoding.arrayToUtf8(buffer);
    let data;
    try {
        data = JSON.parse(utf8);
    }
    catch (error) {
        return null;
    }
    return data;
}
//# sourceMappingURL=index.js.map