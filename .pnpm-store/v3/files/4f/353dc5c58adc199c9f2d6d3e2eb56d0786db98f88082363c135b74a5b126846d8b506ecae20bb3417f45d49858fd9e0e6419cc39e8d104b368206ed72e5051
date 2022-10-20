import crypto from "crypto";
import { bufferToArray, concatBuffers } from "@walletconnect/encoding";
import { HMAC_NODE_ALGO, AES_NODE_ALGO, SHA512_NODE_ALGO, SHA256_NODE_ALGO, RIPEMD160_NODE_ALGO, } from "../constants";
export function nodeAesEncrypt(iv, key, data) {
    const cipher = crypto.createCipheriv(AES_NODE_ALGO, Buffer.from(key), Buffer.from(iv));
    return bufferToArray(concatBuffers(cipher.update(Buffer.from(data)), cipher.final()));
}
export function nodeAesDecrypt(iv, key, data) {
    const decipher = crypto.createDecipheriv(AES_NODE_ALGO, Buffer.from(key), Buffer.from(iv));
    return bufferToArray(concatBuffers(decipher.update(Buffer.from(data)), decipher.final()));
}
export function nodeHmacSha256Sign(key, data) {
    const buf = crypto
        .createHmac(HMAC_NODE_ALGO, Buffer.from(key))
        .update(Buffer.from(data))
        .digest();
    return bufferToArray(buf);
}
export function nodeHmacSha512Sign(key, data) {
    const buf = crypto
        .createHmac(SHA512_NODE_ALGO, Buffer.from(key))
        .update(Buffer.from(data))
        .digest();
    return bufferToArray(buf);
}
export function nodeSha256(data) {
    const buf = crypto
        .createHash(SHA256_NODE_ALGO)
        .update(Buffer.from(data))
        .digest();
    return bufferToArray(buf);
}
export function nodeSha512(data) {
    const buf = crypto
        .createHash(SHA512_NODE_ALGO)
        .update(Buffer.from(data))
        .digest();
    return bufferToArray(buf);
}
export function nodeRipemd160(data) {
    const buf = crypto
        .createHash(RIPEMD160_NODE_ALGO)
        .update(Buffer.from(data))
        .digest();
    return bufferToArray(buf);
}
//# sourceMappingURL=node.js.map