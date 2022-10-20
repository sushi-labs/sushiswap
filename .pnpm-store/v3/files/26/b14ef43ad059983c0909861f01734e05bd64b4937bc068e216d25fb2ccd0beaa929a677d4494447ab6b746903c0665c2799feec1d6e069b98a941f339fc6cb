"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSstoreGas = exports.writeCallOutput = exports.subMemUsage = exports.maxCallGas = exports.jumpSubIsValid = exports.jumpIsValid = exports.getFullname = exports.getDataSlice = exports.short = exports.divCeil = exports.describeLocation = exports.addressToBuffer = exports.trap = exports.setLengthLeftStorage = void 0;
var ethereumjs_util_1 = require("ethereumjs-util");
var exceptions_1 = require("./../../exceptions");
var MASK_160 = new ethereumjs_util_1.BN(1).shln(160).subn(1);
/**
 * Proxy function for ethereumjs-util's setLengthLeft, except it returns a zero
 *
 * length buffer in case the buffer is full of zeros.
 * @param {Buffer} value Buffer which we want to pad
 */
function setLengthLeftStorage(value) {
    if (value.equals(Buffer.alloc(value.length, 0))) {
        // return the empty buffer (the value is zero)
        return Buffer.alloc(0);
    }
    else {
        return (0, ethereumjs_util_1.setLengthLeft)(value, 32);
    }
}
exports.setLengthLeftStorage = setLengthLeftStorage;
/**
 * Wraps error message as VMError
 *
 * @param {string} err
 */
function trap(err) {
    // TODO: facilitate extra data along with errors
    throw new exceptions_1.VmError(err);
}
exports.trap = trap;
/**
 * Converts BN address (they're stored like this on the stack) to buffer address
 *
 * @param  {BN}     address
 * @return {Buffer}
 */
function addressToBuffer(address) {
    if (Buffer.isBuffer(address))
        return address;
    return address.and(MASK_160).toArrayLike(Buffer, 'be', 20);
}
exports.addressToBuffer = addressToBuffer;
/**
 * Error message helper - generates location string
 *
 * @param  {RunState} runState
 * @return {string}
 */
function describeLocation(runState) {
    var hash = (0, ethereumjs_util_1.keccak256)(runState.eei.getCode()).toString('hex');
    var address = runState.eei.getAddress().buf.toString('hex');
    var pc = runState.programCounter - 1;
    return "".concat(hash, "/").concat(address, ":").concat(pc);
}
exports.describeLocation = describeLocation;
/**
 * Find Ceil(a / b)
 *
 * @param {BN} a
 * @param {BN} b
 * @return {BN}
 */
function divCeil(a, b) {
    var div = a.div(b);
    var mod = a.mod(b);
    // Fast case - exact division
    if (mod.isZero())
        return div;
    // Round up
    return div.isNeg() ? div.isubn(1) : div.iaddn(1);
}
exports.divCeil = divCeil;
function short(buffer) {
    var MAX_LENGTH = 50;
    var bufferStr = buffer.toString('hex');
    if (bufferStr.length <= MAX_LENGTH) {
        return bufferStr;
    }
    return bufferStr.slice(0, MAX_LENGTH) + '...';
}
exports.short = short;
/**
/**
 * Returns an overflow-safe slice of an array. It right-pads
 * the data with zeros to `length`.
 *
 * @param {BN} offset
 * @param {BN} length
 * @param {Buffer} data
 * @returns {Buffer}
 */
function getDataSlice(data, offset, length) {
    var len = new ethereumjs_util_1.BN(data.length);
    if (offset.gt(len)) {
        offset = len;
    }
    var end = offset.add(length);
    if (end.gt(len)) {
        end = len;
    }
    data = data.slice(offset.toNumber(), end.toNumber());
    // Right-pad with zeros to fill dataLength bytes
    data = (0, ethereumjs_util_1.setLengthRight)(data, length.toNumber());
    return data;
}
exports.getDataSlice = getDataSlice;
/**
 * Get full opcode name from its name and code.
 *
 * @param code {number} Integer code of opcode.
 * @param name {string} Short name of the opcode.
 * @returns {string} Full opcode name
 */
function getFullname(code, name) {
    switch (name) {
        case 'LOG':
            name += code - 0xa0;
            break;
        case 'PUSH':
            name += code - 0x5f;
            break;
        case 'DUP':
            name += code - 0x7f;
            break;
        case 'SWAP':
            name += code - 0x8f;
            break;
    }
    return name;
}
exports.getFullname = getFullname;
/**
 * Checks if a jump is valid given a destination (defined as a 1 in the validJumps array)
 *
 * @param  {RunState} runState
 * @param  {number}   dest
 * @return {boolean}
 */
function jumpIsValid(runState, dest) {
    return runState.validJumps[dest] === 1;
}
exports.jumpIsValid = jumpIsValid;
/**
 * Checks if a jumpsub is valid given a destination (defined as a 2 in the validJumps array)
 *
 * @param  {RunState} runState
 * @param  {number}   dest
 * @return {boolean}
 */
function jumpSubIsValid(runState, dest) {
    return runState.validJumps[dest] === 2;
}
exports.jumpSubIsValid = jumpSubIsValid;
/**
 * Returns an overflow-safe slice of an array. It right-pads
 *
 * the data with zeros to `length`.
 * @param {BN} gasLimit - requested gas Limit
 * @param {BN} gasLeft - current gas left
 * @param {RunState} runState - the current runState
 * @param {Common} common - the common
 */
function maxCallGas(gasLimit, gasLeft, runState, common) {
    var isTangerineWhistleOrLater = common.gteHardfork('tangerineWhistle');
    if (isTangerineWhistleOrLater) {
        var gasAllowed = gasLeft.sub(gasLeft.divn(64));
        return gasLimit.gt(gasAllowed) ? gasAllowed : gasLimit;
    }
    else {
        return gasLimit;
    }
}
exports.maxCallGas = maxCallGas;
/**
 * Subtracts the amount needed for memory usage from `runState.gasLeft`
 *
 * @method subMemUsage
 * @param {Object} runState
 * @param {BN} offset
 * @param {BN} length
 */
function subMemUsage(runState, offset, length, common) {
    // YP (225): access with zero length will not extend the memory
    if (length.isZero())
        return new ethereumjs_util_1.BN(0);
    var newMemoryWordCount = divCeil(offset.add(length), new ethereumjs_util_1.BN(32));
    if (newMemoryWordCount.lte(runState.memoryWordCount))
        return new ethereumjs_util_1.BN(0);
    var words = newMemoryWordCount;
    var fee = new ethereumjs_util_1.BN(common.param('gasPrices', 'memory'));
    var quadCoeff = new ethereumjs_util_1.BN(common.param('gasPrices', 'quadCoeffDiv'));
    // words * 3 + words ^2 / 512
    var cost = words.mul(fee).add(words.mul(words).div(quadCoeff));
    if (cost.gt(runState.highestMemCost)) {
        var currentHighestMemCost = runState.highestMemCost;
        runState.highestMemCost = cost.clone();
        cost.isub(currentHighestMemCost);
    }
    runState.memoryWordCount = newMemoryWordCount;
    return cost;
}
exports.subMemUsage = subMemUsage;
/**
 * Writes data returned by eei.call* methods to memory
 *
 * @param {RunState} runState
 * @param {BN}       outOffset
 * @param {BN}       outLength
 */
function writeCallOutput(runState, outOffset, outLength) {
    var returnData = runState.eei.getReturnData();
    if (returnData.length > 0) {
        var memOffset = outOffset.toNumber();
        var dataLength = outLength.toNumber();
        if (returnData.length < dataLength) {
            dataLength = returnData.length;
        }
        var data = getDataSlice(returnData, new ethereumjs_util_1.BN(0), new ethereumjs_util_1.BN(dataLength));
        runState.memory.write(memOffset, dataLength, data);
    }
}
exports.writeCallOutput = writeCallOutput;
/** The first rule set of SSTORE rules, which are the rules pre-Constantinople and in Petersburg
 * @param {RunState} runState
 * @param {Buffer}   currentStorage
 * @param {Buffer}   value
 * @param {Buffer}   keyBuf
 */
function updateSstoreGas(runState, currentStorage, value, common) {
    if ((value.length === 0 && currentStorage.length === 0) ||
        (value.length > 0 && currentStorage.length > 0)) {
        var gas = new ethereumjs_util_1.BN(common.param('gasPrices', 'sstoreReset'));
        return gas;
    }
    else if (value.length === 0 && currentStorage.length > 0) {
        var gas = new ethereumjs_util_1.BN(common.param('gasPrices', 'sstoreReset'));
        runState.eei.refundGas(new ethereumjs_util_1.BN(common.param('gasPrices', 'sstoreRefund')), 'updateSstoreGas');
        return gas;
    }
    else {
        /*
          The situations checked above are:
          -> Value/Slot are both 0
          -> Value/Slot are both nonzero
          -> Value is zero, but slot is nonzero
          Thus, the remaining case is where value is nonzero, but slot is zero, which is this clause
        */
        return new ethereumjs_util_1.BN(common.param('gasPrices', 'sstoreSet'));
    }
}
exports.updateSstoreGas = updateSstoreGas;
//# sourceMappingURL=util.js.map