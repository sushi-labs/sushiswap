# @walletconnect/encoding [![npm version](https://badge.fury.io/js/@walletconnect/encoding.svg)](https://badge.fury.io/js/@walletconnect/encoding)

Byte encoding utils

## API

```typescript
// -- Buffer --------------------------------------------- //

function bufferToUtf8(buf: Buffer): string;
function bufferToHex(buf: Buffer, prefixed?: boolean): string;
function bufferToArray(buf: Buffer): Uint8Array;
function bufferToNumber(buf: Buffer): number;
function bufferToBinary(buf: Buffer): string;

// -- Utf8 ----------------------------------------------- //

function utf8ToBuffer(utf8: string): Buffer;
function utf8ToHex(utf8: string, prefixed?: boolean): string;
function utf8ToArray(utf8: string): Uint8Array;
function utf8ToNumber(utf8: string): number;
function utf8ToBinary(utf8: string): string;

// -- Hex ------------------------------------------------ //

function hexToBuffer(hex: string): Buffer;
function hexToUtf8(hex: string): string;
function hexToArray(hex: string): Uint8Array;
function hexToNumber(hex: string): number;
function hexToBinary(hex: string): string;

// -- Uint8Array ----------------------------------------- //

function arrayToBuffer(arr: Uint8Array): Buffer;
function arrayToUtf8(arr: Uint8Array): string;
function arrayToHex(arr: Uint8Array, prefixed?: boolean): string;
function arrayToNumber(arr: Uint8Array): number;
function arrayToBinary(arr: Uint8Array): string;

// -- Number ---------------------------------------- //

function numberToBuffer(num: number): Buffer;
function numberToUtf8(num: number): string;
function numberToHex(num: number, prefixed?: boolean): string;
function numberToArray(num: number): Uint8Array;
function numberToBinary(num: number): string;

// -- Binary ----------------------------------------------- //

function binaryToBuffer(bin: string): Buffer;
function binaryToArray(bin: string): Uint8Array;
function binaryToHex(bin: string | string, prefixed?: boolean): string;
function binaryToUtf8(bin: string): string;
function binaryToNumber(bin: string): number;

// -- Validators ----------------------------------------- //

function isBinaryString(str: any): boolean;
function isHexString(str: any, length?: number): boolean;
function isBuffer(val: any): boolean;
function isTypedArray(val: any): boolean;
function isArrayBuffer(val: any): boolean;

function getType(val: any);
function getEncoding(str: string);

// -- Misc ----------------------------------------------- //

function concatBuffers(...args: Buffer[]): Buffer;
function concatArrays(...args: Uint8Array[]): Uint8Array;
function trimLeft(data: Buffer, length: number): Buffer;
function trimRight(data: Buffer, length: number): Buffer;

function calcByteLength(length: number, byteSize: number): number;
function splitBytes(str: string, byteSize: number): string[];
function sanitizeBytes(str: string, byteSize: number, padding: string): string;
function swapBytes(str: string): string;
function swapHex(str: string): string;

function padLeft(str: string, length: number, padding?: string): string;
function padRight(str: string, length: number, padding?: string): string;

function removeHexPrefix(hex: string): string;
function addHexPrefix(hex: string): string;
function sanitizeHex(hex: string): string;
function removeHexLeadingZeros(hex: string): string;
```
