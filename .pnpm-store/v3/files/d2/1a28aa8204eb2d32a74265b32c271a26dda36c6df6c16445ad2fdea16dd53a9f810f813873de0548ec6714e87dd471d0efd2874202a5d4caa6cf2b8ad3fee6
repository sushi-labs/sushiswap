export = Base;
/** @typedef {import('./types').CodecFactory} CodecFactory */
/** @typedef {import("./types").BaseName} BaseName */
/** @typedef {import("./types").BaseCode} BaseCode */
/**
 * Class to encode/decode in the supported Bases
 *
 */
declare class Base {
    /**
     * @param {BaseName} name
     * @param {BaseCode} code
     * @param {CodecFactory} factory
     * @param {string} alphabet
     */
    constructor(name: BaseName, code: BaseCode, factory: CodecFactory, alphabet: string);
    name: import("./types").BaseName;
    code: import("./types").BaseCode;
    codeBuf: Uint8Array;
    alphabet: string;
    codec: import("./types").Codec;
    /**
     * @param {Uint8Array} buf
     * @returns {string}
     */
    encode(buf: Uint8Array): string;
    /**
     * @param {string} string
     * @returns {Uint8Array}
     */
    decode(string: string): Uint8Array;
}
declare namespace Base {
    export { CodecFactory, BaseName, BaseCode };
}
type BaseName = import("./types").BaseName;
type BaseCode = import("./types").BaseCode;
type CodecFactory = import('./types').CodecFactory;
//# sourceMappingURL=base.d.ts.map