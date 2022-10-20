"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validOpcodes = exports.codeAnalysis = exports.VERSION = exports.MAGIC = exports.FORMAT = void 0;
var _1 = require(".");
exports.FORMAT = 0xef;
exports.MAGIC = 0x00;
exports.VERSION = 0x01;
/**
 *
 * @param container A `Buffer` containing bytecode to be checked for EOF1 compliance
 * @returns an object containing the size of the code section and data sections for a valid
 * EOF1 container or else undefined if `container` is not valid EOF1 bytecode
 *
 * Note: See https://eips.ethereum.org/EIPS/eip-3540 for further details
 */
var codeAnalysis = function (container) {
    var secCode = 0x01;
    var secData = 0x02;
    var secTerminator = 0x00;
    var computedContainerSize = 0;
    var sectionSizes = {
        code: 0,
        data: 0,
    };
    if (container[1] !== exports.MAGIC || container[2] !== exports.VERSION)
        // Bytecode does not contain EOF1 "magic" or version number in expected positions
        return;
    if (
    // EOF1 bytecode must be more than 7 bytes long for EOF1 header plus code section (but no data section)
    container.length > 7 &&
        // EOF1 code section indicator
        container[3] === secCode &&
        // EOF1 header terminator
        container[6] === secTerminator) {
        sectionSizes.code = (container[4] << 8) | container[5];
        // Calculate expected length of EOF1 container based on code section
        computedContainerSize = 7 + sectionSizes.code;
        // EOF1 code section must be at least 1 byte long
        if (sectionSizes.code < 1)
            return;
    }
    else if (
    // EOF1 container must be more than 10 bytes long if data section is included
    container.length > 10 &&
        // EOF1 code section indicator
        container[3] === secCode &&
        // EOF1 data section indicator
        container[6] === secData &&
        // EOF1 header terminator
        container[9] === secTerminator) {
        sectionSizes.code = (container[4] << 8) | container[5];
        sectionSizes.data = (container[7] << 8) | container[8];
        // Calculate expected length of EOF1 container based on code and data sections
        computedContainerSize = 10 + sectionSizes.code + sectionSizes.data;
        // Code & Data sizes cannot be 0
        if (sectionSizes.code < 1 || sectionSizes.data < 1)
            return;
    }
    if (container.length !== computedContainerSize) {
        // Computed container length based on section details does not match length of actual bytecode
        return;
    }
    return sectionSizes;
};
exports.codeAnalysis = codeAnalysis;
var validOpcodes = function (code) {
    // EIP-3670 - validate all opcodes
    var opcodes = new Set(_1.handlers.keys());
    opcodes.add(0xfe); // Add INVALID opcode to set
    var x = 0;
    while (x < code.length) {
        var opcode = code[x];
        x++;
        if (!opcodes.has(opcode)) {
            // No invalid/undefined opcodes
            return false;
        }
        if (opcode >= 0x60 && opcode <= 0x7f) {
            // Skip data block following push
            x += opcode - 0x5f;
            if (x > code.length - 1) {
                // Push blocks must not exceed end of code section
                return false;
            }
        }
    }
    var terminatingOpcodes = new Set([0x00, 0xf3, 0xfd, 0xfe, 0xff]);
    // Per EIP-3670, the final opcode of a code section must be STOP, RETURN, REVERT, INVALID, or SELFDESTRUCT
    if (!terminatingOpcodes.has(code[code.length - 1])) {
        return false;
    }
    return true;
};
exports.validOpcodes = validOpcodes;
//# sourceMappingURL=eof.js.map