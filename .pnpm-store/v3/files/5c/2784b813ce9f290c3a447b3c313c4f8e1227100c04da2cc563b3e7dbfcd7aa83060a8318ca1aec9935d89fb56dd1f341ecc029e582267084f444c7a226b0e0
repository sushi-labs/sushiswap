import { stringPad } from "./stringPad.js";
/**
 * This file maps sequences of 6 bit binary digits to a character in base64.
 * 000000 -> A
 * 110011 -> Z
 * 111111 -> /
 */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const base64Map = {};
let num = 0;
chars.split('').forEach((char) => {
    let key = num.toString(2);
    key = stringPad(key, 6, '0');
    base64Map[key] = char;
    num++;
});
/**
 * Map of [six-bit binary codes] -> [Base64 characters]
 */
export { base64Map };
