/// <reference types="node" />
export declare const FORMAT = 239;
export declare const MAGIC = 0;
export declare const VERSION = 1;
/**
 *
 * @param container A `Buffer` containing bytecode to be checked for EOF1 compliance
 * @returns an object containing the size of the code section and data sections for a valid
 * EOF1 container or else undefined if `container` is not valid EOF1 bytecode
 *
 * Note: See https://eips.ethereum.org/EIPS/eip-3540 for further details
 */
export declare const codeAnalysis: (container: Buffer) => {
    code: number;
    data: number;
} | undefined;
export declare const validOpcodes: (code: Buffer) => boolean;
