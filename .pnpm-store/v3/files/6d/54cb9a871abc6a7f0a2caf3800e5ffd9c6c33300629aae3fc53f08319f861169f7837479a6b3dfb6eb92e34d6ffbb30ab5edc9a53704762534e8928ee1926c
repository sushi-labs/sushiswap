"use strict";
// Copyright (c) 2018-2022 Coinbase, Inc. <https://www.coinbase.com/>
// Licensed under the Apache License, version 2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const rxjs_1 = require("rxjs");
const util_1 = require("../util");
/**
 *
 * @param plainText string to be encrypted
 * @param secret hex representation of 32-byte secret
 * returns hex string representation of bytes in the order: initialization vector (iv),
 * auth tag, encrypted plaintext. IV is 12 bytes. Auth tag is 16 bytes. Remaining bytes are the
 * encrypted plainText.
 */
async function encrypt(plainText, secret) {
    if (secret.length !== 64)
        throw Error(`secret must be 256 bits`);
    const ivBytes = crypto.getRandomValues(new Uint8Array(12));
    const secretKey = await crypto.subtle.importKey("raw", (0, util_1.hexStringToUint8Array)(secret), { name: "aes-gcm" }, false, ["encrypt", "decrypt"]);
    const enc = new TextEncoder();
    // Will return encrypted plainText with auth tag (ie MAC or checksum) appended at the end
    const encryptedResult = await window.crypto.subtle.encrypt({
        name: "AES-GCM",
        iv: ivBytes,
    }, secretKey, enc.encode(plainText));
    const tagLength = 16;
    const authTag = encryptedResult.slice(encryptedResult.byteLength - tagLength);
    const encryptedPlaintext = encryptedResult.slice(0, encryptedResult.byteLength - tagLength);
    const authTagBytes = new Uint8Array(authTag);
    const encryptedPlaintextBytes = new Uint8Array(encryptedPlaintext);
    const concatted = new Uint8Array([
        ...ivBytes,
        ...authTagBytes,
        ...encryptedPlaintextBytes,
    ]);
    return (0, util_1.uint8ArrayToHex)(concatted);
}
exports.encrypt = encrypt;
/**
 *
 * @param cipherText hex string representation of bytes in the order: initialization vector (iv),
 * auth tag, encrypted plaintext. IV is 12 bytes. Auth tag is 16 bytes.
 * @param secret hex string representation of 32-byte secret
 *
 * TODO: Update rxjs for promises
 */
function decrypt(cipherText, secret) {
    if (secret.length !== 64)
        throw Error(`secret must be 256 bits`);
    return new rxjs_1.Observable(subscriber => {
        void (async function () {
            const secretKey = await crypto.subtle.importKey("raw", (0, util_1.hexStringToUint8Array)(secret), { name: "aes-gcm" }, false, ["encrypt", "decrypt"]);
            const encrypted = (0, util_1.hexStringToUint8Array)(cipherText);
            const ivBytes = encrypted.slice(0, 12);
            const authTagBytes = encrypted.slice(12, 28);
            const encryptedPlaintextBytes = encrypted.slice(28);
            const concattedBytes = new Uint8Array([
                ...encryptedPlaintextBytes,
                ...authTagBytes,
            ]);
            const algo = {
                name: "AES-GCM",
                iv: new Uint8Array(ivBytes),
            };
            try {
                const decrypted = await window.crypto.subtle.decrypt(algo, secretKey, concattedBytes);
                const decoder = new TextDecoder();
                subscriber.next(decoder.decode(decrypted));
                subscriber.complete();
            }
            catch (err) {
                subscriber.error(err);
            }
        })();
    });
}
exports.decrypt = decrypt;
