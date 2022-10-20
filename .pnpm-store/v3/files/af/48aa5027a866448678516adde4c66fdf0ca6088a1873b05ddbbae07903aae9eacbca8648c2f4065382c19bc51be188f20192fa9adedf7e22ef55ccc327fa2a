"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAGIC_VALUE_BYTES = exports.MAGIC_VALUE = exports.EIP_1271_BYTES_INTERFACE = exports.EIP_1271_INTERFACE = void 0;
const ethers_1 = require("ethers");
const MAGIC_VALUE = '0x1626ba7e';
exports.MAGIC_VALUE = MAGIC_VALUE;
const MAGIC_VALUE_BYTES = '0x20c13b0b';
exports.MAGIC_VALUE_BYTES = MAGIC_VALUE_BYTES;
const EIP_1271_INTERFACE = new ethers_1.ethers.utils.Interface([
    'function isValidSignature(bytes32 _dataHash, bytes calldata _signature) external view',
]);
exports.EIP_1271_INTERFACE = EIP_1271_INTERFACE;
const EIP_1271_BYTES_INTERFACE = new ethers_1.ethers.utils.Interface([
    'function isValidSignature(bytes calldata _data, bytes calldata _signature) public view',
]);
exports.EIP_1271_BYTES_INTERFACE = EIP_1271_BYTES_INTERFACE;
//# sourceMappingURL=signatures.js.map