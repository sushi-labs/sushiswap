export = multibase;
/** @typedef {import('./base')} Base */
/** @typedef {import("./types").BaseNameOrCode} BaseNameOrCode */
/** @typedef {import("./types").BaseCode} BaseCode */
/** @typedef {import("./types").BaseName} BaseName */
/**
 * Create a new Uint8Array with the multibase varint+code.
 *
 * @param {BaseNameOrCode} nameOrCode - The multibase name or code number.
 * @param {Uint8Array} buf - The data to be prefixed with multibase.
 * @returns {Uint8Array}
 * @throws {Error} Will throw if the encoding is not supported
 */
declare function multibase(nameOrCode: BaseNameOrCode, buf: Uint8Array): Uint8Array;
declare namespace multibase {
    export { encode, decode, isEncoded, encoding, encodingFromData, names, codes, Base, BaseNameOrCode, BaseCode, BaseName };
}
type BaseNameOrCode = import("./types").BaseNameOrCode;
/**
 * Encode data with the specified base and add the multibase prefix.
 *
 * @param {BaseNameOrCode} nameOrCode - The multibase name or code number.
 * @param {Uint8Array} buf - The data to be encoded.
 * @returns {Uint8Array}
 * @throws {Error} Will throw if the encoding is not supported
 *
 */
declare function encode(nameOrCode: BaseNameOrCode, buf: Uint8Array): Uint8Array;
/**
 * Takes a Uint8Array or string encoded with multibase header, decodes it and
 * returns the decoded buffer
 *
 * @param {Uint8Array|string} data
 * @returns {Uint8Array}
 * @throws {Error} Will throw if the encoding is not supported
 *
 */
declare function decode(data: Uint8Array | string): Uint8Array;
/**
 * Is the given data multibase encoded?
 *
 * @param {Uint8Array|string} data
 */
declare function isEncoded(data: Uint8Array | string): false | import("./types").BaseName;
/**
 * Get the encoding by name or code
 *
 * @param {BaseNameOrCode} nameOrCode
 * @returns {Base}
 * @throws {Error} Will throw if the encoding is not supported
 */
declare function encoding(nameOrCode: BaseNameOrCode): Base;
/**
 * Get encoding from data
 *
 * @param {string|Uint8Array} data
 * @returns {Base}
 * @throws {Error} Will throw if the encoding is not supported
 */
declare function encodingFromData(data: string | Uint8Array): Base;
declare const names: Readonly<Record<import("./types").BaseName, import("./base")>>;
declare const codes: Readonly<Record<import("./types").BaseCode, import("./base")>>;
type Base = import('./base');
type BaseCode = import("./types").BaseCode;
type BaseName = import("./types").BaseName;
//# sourceMappingURL=index.d.ts.map