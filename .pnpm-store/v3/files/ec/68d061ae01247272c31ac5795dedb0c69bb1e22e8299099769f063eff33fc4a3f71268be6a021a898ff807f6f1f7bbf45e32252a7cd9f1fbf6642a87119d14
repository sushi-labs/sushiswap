export type HashCode = import("./constants").HashCode;
export type HashName = import("./constants").HashName;
import { names } from "./constants";
export const codes: import('./types').CodeNameMap;
/**
 * Convert the given multihash to a hex encoded string.
 *
 * @param {Uint8Array} hash
 * @returns {string}
 */
export function toHexString(hash: Uint8Array): string;
/**
 * Convert the given hex encoded string to a multihash.
 *
 * @param {string} hash
 * @returns {Uint8Array}
 */
export function fromHexString(hash: string): Uint8Array;
/**
 * Convert the given multihash to a base58 encoded string.
 *
 * @param {Uint8Array} hash
 * @returns {string}
 */
export function toB58String(hash: Uint8Array): string;
/**
 * Convert the given base58 encoded string to a multihash.
 *
 * @param {string|Uint8Array} hash
 * @returns {Uint8Array}
 */
export function fromB58String(hash: string | Uint8Array): Uint8Array;
/**
 * Decode a hash from the given multihash.
 *
 * @param {Uint8Array} bytes
 * @returns {{code: HashCode, name: HashName, length: number, digest: Uint8Array}} result
 */
export function decode(bytes: Uint8Array): {
    code: HashCode;
    name: HashName;
    length: number;
    digest: Uint8Array;
};
/**
 * Encode a hash digest along with the specified function code.
 *
 * > **Note:** the length is derived from the length of the digest itself.
 *
 * @param {Uint8Array} digest
 * @param {HashName | HashCode} code
 * @param {number} [length]
 * @returns {Uint8Array}
 */
export function encode(digest: Uint8Array, code: HashName | HashCode, length?: number | undefined): Uint8Array;
/**
 * Converts a hash function name into the matching code.
 * If passed a number it will return the number if it's a valid code.
 *
 * @param {HashName | number} name
 * @returns {number}
 */
export function coerceCode(name: HashName | number): number;
/**
 * Checks if a code is part of the app range
 *
 * @param {number} code
 * @returns {boolean}
 */
export function isAppCode(code: number): boolean;
/**
 * Check if the given buffer is a valid multihash. Throws an error if it is not valid.
 *
 * @param {Uint8Array} multihash
 * @returns {void}
 * @throws {Error}
 */
export function validate(multihash: Uint8Array): void;
/**
 * Returns a prefix from a valid multihash. Throws an error if it is not valid.
 *
 * @param {Uint8Array} multihash
 * @returns {Uint8Array}
 * @throws {Error}
 */
export function prefix(multihash: Uint8Array): Uint8Array;
/**
 * Checks whether a multihash code is valid.
 *
 * @param {HashCode} code
 * @returns {boolean}
 */
export function isValidCode(code: HashCode): boolean;
export { names };
//# sourceMappingURL=index.d.ts.map