/// <reference types="node" />
import BN from "bn.js";
import { AddressString, BigIntString, HexString, IntNumber, RegExpString } from "./types";
/**
 * @param length number of bytes
 */
export declare function randomBytesHex(length: number): string;
export declare function uint8ArrayToHex(value: Uint8Array): string;
export declare function hexStringToUint8Array(hexString: string): Uint8Array;
export declare function hexStringFromBuffer(buf: Buffer, includePrefix?: boolean): HexString;
export declare function bigIntStringFromBN(bn: BN): BigIntString;
export declare function intNumberFromHexString(hex: HexString): IntNumber;
export declare function hexStringFromIntNumber(num: IntNumber): HexString;
export declare function has0xPrefix(str: string): boolean;
export declare function strip0x(hex: string): string;
export declare function prepend0x(hex: string): string;
export declare function isHexString(hex: unknown): hex is HexString;
export declare function ensureHexString(hex: unknown, includePrefix?: boolean): HexString;
export declare function ensureEvenLengthHexString(hex: unknown, includePrefix?: boolean): HexString;
export declare function ensureAddressString(str: unknown): AddressString;
export declare function ensureBuffer(str: unknown): Buffer;
export declare function ensureIntNumber(num: unknown): IntNumber;
export declare function ensureRegExpString(regExp: unknown): RegExpString;
export declare function ensureBN(val: unknown): BN;
export declare function ensureParsedJSONObject<T extends object>(val: unknown): T;
export declare function isBigNumber(val: unknown): boolean;
export declare function range(start: number, stop: number): number[];
export declare function getFavicon(): string | null;
export declare function createQrUrl(sessionId: string, sessionSecret: string, serverUrl: string, isParentConnection: boolean): string;
