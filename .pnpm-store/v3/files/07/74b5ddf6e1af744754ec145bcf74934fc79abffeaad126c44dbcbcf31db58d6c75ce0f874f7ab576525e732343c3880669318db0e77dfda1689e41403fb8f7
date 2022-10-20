"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicGasHandlers = void 0;
var _1 = require(".");
var ethereumjs_util_1 = require("ethereumjs-util");
var exceptions_1 = require("../../exceptions");
var EIP1283_1 = require("./EIP1283");
var EIP2200_1 = require("./EIP2200");
var EIP2929_1 = require("./EIP2929");
exports.dynamicGasHandlers = new Map([
    [
        /* SHA3 */
        0x20,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, offset, length;
                return __generator(this, function (_b) {
                    _a = __read(runState.stack.peek(2), 2), offset = _a[0], length = _a[1];
                    gas.iadd((0, _1.subMemUsage)(runState, offset, length, common));
                    gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'sha3Word')).imul((0, _1.divCeil)(length, new ethereumjs_util_1.BN(32))));
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* BALANCE */
        0x31,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var addressBN, address;
                return __generator(this, function (_a) {
                    if (common.isActivatedEIP(2929)) {
                        addressBN = runState.stack.peek()[0];
                        address = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(addressBN));
                        gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, address, common));
                    }
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* CALLDATACOPY */
        0x37,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, memOffset, _dataOffset, dataLength;
                return __generator(this, function (_b) {
                    _a = __read(runState.stack.peek(3), 3), memOffset = _a[0], _dataOffset = _a[1], dataLength = _a[2];
                    gas.iadd((0, _1.subMemUsage)(runState, memOffset, dataLength, common));
                    if (!dataLength.eqn(0)) {
                        gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'copy')).imul((0, _1.divCeil)(dataLength, new ethereumjs_util_1.BN(32))));
                    }
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* CODECOPY */
        0x39,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, memOffset, _codeOffset, dataLength;
                return __generator(this, function (_b) {
                    _a = __read(runState.stack.peek(3), 3), memOffset = _a[0], _codeOffset = _a[1], dataLength = _a[2];
                    gas.iadd((0, _1.subMemUsage)(runState, memOffset, dataLength, common));
                    if (!dataLength.eqn(0)) {
                        gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'copy')).imul((0, _1.divCeil)(dataLength, new ethereumjs_util_1.BN(32))));
                    }
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* EXTCODESIZE */
        0x3b,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var addressBN, address;
                return __generator(this, function (_a) {
                    if (common.isActivatedEIP(2929)) {
                        addressBN = runState.stack.peek()[0];
                        address = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(addressBN));
                        gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, address, common));
                    }
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* EXTCODECOPY */
        0x3c,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, addressBN, memOffset, _codeOffset, dataLength, address;
                return __generator(this, function (_b) {
                    _a = __read(runState.stack.peek(4), 4), addressBN = _a[0], memOffset = _a[1], _codeOffset = _a[2], dataLength = _a[3];
                    gas.iadd((0, _1.subMemUsage)(runState, memOffset, dataLength, common));
                    if (common.isActivatedEIP(2929)) {
                        address = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(addressBN));
                        gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, address, common));
                    }
                    if (!dataLength.eqn(0)) {
                        gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'copy')).imul((0, _1.divCeil)(dataLength, new ethereumjs_util_1.BN(32))));
                    }
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* RETURNDATACOPY */
        0x3e,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, memOffset, returnDataOffset, dataLength;
                return __generator(this, function (_b) {
                    _a = __read(runState.stack.peek(3), 3), memOffset = _a[0], returnDataOffset = _a[1], dataLength = _a[2];
                    if (returnDataOffset.add(dataLength).gt(runState.eei.getReturnDataSize())) {
                        (0, _1.trap)(exceptions_1.ERROR.OUT_OF_GAS);
                    }
                    gas.iadd((0, _1.subMemUsage)(runState, memOffset, dataLength, common));
                    if (!dataLength.eqn(0)) {
                        gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'copy')).mul((0, _1.divCeil)(dataLength, new ethereumjs_util_1.BN(32))));
                    }
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* EXTCODEHASH */
        0x3f,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var addressBN, address;
                return __generator(this, function (_a) {
                    if (common.isActivatedEIP(2929)) {
                        addressBN = runState.stack.peek()[0];
                        address = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(addressBN));
                        gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, address, common));
                    }
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* MLOAD */
        0x51,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var pos;
                return __generator(this, function (_a) {
                    pos = runState.stack.peek()[0];
                    gas.iadd((0, _1.subMemUsage)(runState, pos, new ethereumjs_util_1.BN(32), common));
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* MSTORE */
        0x52,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var offset;
                return __generator(this, function (_a) {
                    offset = runState.stack.peek()[0];
                    gas.iadd((0, _1.subMemUsage)(runState, offset, new ethereumjs_util_1.BN(32), common));
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* MSTORE8 */
        0x53,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var offset;
                return __generator(this, function (_a) {
                    offset = runState.stack.peek()[0];
                    gas.iadd((0, _1.subMemUsage)(runState, offset, new ethereumjs_util_1.BN(1), common));
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* SLOAD */
        0x54,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var key, keyBuf;
                return __generator(this, function (_a) {
                    key = runState.stack.peek()[0];
                    keyBuf = key.toArrayLike(Buffer, 'be', 32);
                    if (common.isActivatedEIP(2929)) {
                        gas.iadd((0, EIP2929_1.accessStorageEIP2929)(runState, keyBuf, false, common));
                    }
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* SSTORE */
        0x55,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, key, val, keyBuf, value, currentStorage, _b, originalStorage, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (runState.eei.isStatic()) {
                                (0, _1.trap)(exceptions_1.ERROR.STATIC_STATE_CHANGE);
                            }
                            _a = __read(runState.stack.peek(2), 2), key = _a[0], val = _a[1];
                            keyBuf = key.toArrayLike(Buffer, 'be', 32);
                            if (val.isZero()) {
                                value = Buffer.from([]);
                            }
                            else {
                                value = val.toArrayLike(Buffer, 'be');
                            }
                            _b = _1.setLengthLeftStorage;
                            return [4 /*yield*/, runState.eei.storageLoad(keyBuf)];
                        case 1:
                            currentStorage = _b.apply(void 0, [_d.sent()]);
                            _c = _1.setLengthLeftStorage;
                            return [4 /*yield*/, runState.eei.storageLoad(keyBuf, true)];
                        case 2:
                            originalStorage = _c.apply(void 0, [_d.sent()]);
                            if (common.hardfork() === 'constantinople') {
                                gas.iadd((0, EIP1283_1.updateSstoreGasEIP1283)(runState, currentStorage, originalStorage, (0, _1.setLengthLeftStorage)(value), common));
                            }
                            else if (common.gteHardfork('istanbul')) {
                                gas.iadd((0, EIP2200_1.updateSstoreGasEIP2200)(runState, currentStorage, originalStorage, (0, _1.setLengthLeftStorage)(value), keyBuf, common));
                            }
                            else {
                                gas.iadd((0, _1.updateSstoreGas)(runState, currentStorage, (0, _1.setLengthLeftStorage)(value), common));
                            }
                            if (common.isActivatedEIP(2929)) {
                                // We have to do this after the Istanbul (EIP2200) checks.
                                // Otherwise, we might run out of gas, due to "sentry check" of 2300 gas,
                                // if we deduct extra gas first.
                                gas.iadd((0, EIP2929_1.accessStorageEIP2929)(runState, keyBuf, true, common));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
    ],
    [
        /* LOG */
        0xa0,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, memOffset, memLength, topicsCount;
                return __generator(this, function (_b) {
                    if (runState.eei.isStatic()) {
                        (0, _1.trap)(exceptions_1.ERROR.STATIC_STATE_CHANGE);
                    }
                    _a = __read(runState.stack.peek(2), 2), memOffset = _a[0], memLength = _a[1];
                    topicsCount = runState.opCode - 0xa0;
                    if (topicsCount < 0 || topicsCount > 4) {
                        (0, _1.trap)(exceptions_1.ERROR.OUT_OF_RANGE);
                    }
                    gas.iadd((0, _1.subMemUsage)(runState, memOffset, memLength, common));
                    gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'logTopic'))
                        .imuln(topicsCount)
                        .iadd(memLength.muln(common.param('gasPrices', 'logData'))));
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* CREATE */
        0xf0,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _value, offset, length, initCodeCost, gasLimit;
                return __generator(this, function (_b) {
                    if (runState.eei.isStatic()) {
                        (0, _1.trap)(exceptions_1.ERROR.STATIC_STATE_CHANGE);
                    }
                    _a = __read(runState.stack.peek(3), 3), _value = _a[0], offset = _a[1], length = _a[2];
                    if (common.isActivatedEIP(2929)) {
                        gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, runState.eei.getAddress(), common, false));
                    }
                    gas.iadd((0, _1.subMemUsage)(runState, offset, length, common));
                    if (common.isActivatedEIP(3860)) {
                        initCodeCost = new ethereumjs_util_1.BN(common.param('gasPrices', 'initCodeWordCost')).imul(length.addn(31).divn(32));
                        gas.iadd(initCodeCost);
                    }
                    gasLimit = new ethereumjs_util_1.BN(runState.eei.getGasLeft().isub(gas));
                    gasLimit = (0, _1.maxCallGas)(gasLimit.clone(), gasLimit.clone(), runState, common);
                    runState.messageGasLimit = gasLimit;
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* CALL */
        0xf1,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, currentGasLimit, toAddr, value, inOffset, inLength, outOffset, outLength, toAddress, gasLimit;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = __read(runState.stack.peek(7), 7), currentGasLimit = _a[0], toAddr = _a[1], value = _a[2], inOffset = _a[3], inLength = _a[4], outOffset = _a[5], outLength = _a[6];
                            toAddress = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(toAddr));
                            if (runState.eei.isStatic() && !value.isZero()) {
                                (0, _1.trap)(exceptions_1.ERROR.STATIC_STATE_CHANGE);
                            }
                            gas.iadd((0, _1.subMemUsage)(runState, inOffset, inLength, common));
                            gas.iadd((0, _1.subMemUsage)(runState, outOffset, outLength, common));
                            if (common.isActivatedEIP(2929)) {
                                gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, toAddress, common));
                            }
                            if (!value.isZero()) {
                                gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'callValueTransfer')));
                            }
                            if (!common.gteHardfork('spuriousDragon')) return [3 /*break*/, 2];
                            return [4 /*yield*/, runState.eei.isAccountEmpty(toAddress)];
                        case 1:
                            // We are at or after Spurious Dragon
                            // Call new account gas: account is DEAD and we transfer nonzero value
                            if ((_b.sent()) && !value.isZero()) {
                                gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'callNewAccount')));
                            }
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, runState.eei.accountExists(toAddress)];
                        case 3:
                            if (!(_b.sent())) {
                                // We are before Spurious Dragon and the account does not exist.
                                // Call new account gas: account does not exist (it is not in the state trie, not even as an "empty" account)
                                gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'callNewAccount')));
                            }
                            _b.label = 4;
                        case 4:
                            gasLimit = (0, _1.maxCallGas)(currentGasLimit.clone(), runState.eei.getGasLeft().isub(gas), runState, common);
                            // note that TangerineWhistle or later this cannot happen
                            // (it could have ran out of gas prior to getting here though)
                            if (gasLimit.gt(runState.eei.getGasLeft().isub(gas))) {
                                (0, _1.trap)(exceptions_1.ERROR.OUT_OF_GAS);
                            }
                            if (gas.gt(runState.eei.getGasLeft())) {
                                (0, _1.trap)(exceptions_1.ERROR.OUT_OF_GAS);
                            }
                            if (!value.isZero()) {
                                // TODO: Don't use private attr directly
                                runState.eei._gasLeft.iaddn(common.param('gasPrices', 'callStipend'));
                                gasLimit.iaddn(common.param('gasPrices', 'callStipend'));
                            }
                            runState.messageGasLimit = gasLimit;
                            return [2 /*return*/];
                    }
                });
            });
        },
    ],
    [
        /* CALLCODE */
        0xf2,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, currentGasLimit, toAddr, value, inOffset, inLength, outOffset, outLength, toAddress, gasLimit;
                return __generator(this, function (_b) {
                    _a = __read(runState.stack.peek(7), 7), currentGasLimit = _a[0], toAddr = _a[1], value = _a[2], inOffset = _a[3], inLength = _a[4], outOffset = _a[5], outLength = _a[6];
                    gas.iadd((0, _1.subMemUsage)(runState, inOffset, inLength, common));
                    gas.iadd((0, _1.subMemUsage)(runState, outOffset, outLength, common));
                    if (common.isActivatedEIP(2929)) {
                        toAddress = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(toAddr));
                        gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, toAddress, common));
                    }
                    if (!value.isZero()) {
                        gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'callValueTransfer')));
                    }
                    gasLimit = (0, _1.maxCallGas)(currentGasLimit.clone(), runState.eei.getGasLeft().isub(gas), runState, common);
                    // note that TangerineWhistle or later this cannot happen
                    // (it could have ran out of gas prior to getting here though)
                    if (gasLimit.gt(runState.eei.getGasLeft().isub(gas))) {
                        (0, _1.trap)(exceptions_1.ERROR.OUT_OF_GAS);
                    }
                    if (!value.isZero()) {
                        // TODO: Don't use private attr directly
                        runState.eei._gasLeft.iaddn(common.param('gasPrices', 'callStipend'));
                        gasLimit.iaddn(common.param('gasPrices', 'callStipend'));
                    }
                    runState.messageGasLimit = gasLimit;
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* RETURN */
        0xf3,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, offset, length;
                return __generator(this, function (_b) {
                    _a = __read(runState.stack.peek(2), 2), offset = _a[0], length = _a[1];
                    gas.iadd((0, _1.subMemUsage)(runState, offset, length, common));
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* DELEGATECALL */
        0xf4,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, currentGasLimit, toAddr, inOffset, inLength, outOffset, outLength, toAddress, gasLimit;
                return __generator(this, function (_b) {
                    _a = __read(runState.stack.peek(6), 6), currentGasLimit = _a[0], toAddr = _a[1], inOffset = _a[2], inLength = _a[3], outOffset = _a[4], outLength = _a[5];
                    gas.iadd((0, _1.subMemUsage)(runState, inOffset, inLength, common));
                    gas.iadd((0, _1.subMemUsage)(runState, outOffset, outLength, common));
                    if (common.isActivatedEIP(2929)) {
                        toAddress = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(toAddr));
                        gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, toAddress, common));
                    }
                    gasLimit = (0, _1.maxCallGas)(currentGasLimit.clone(), runState.eei.getGasLeft().isub(gas), runState, common);
                    // note that TangerineWhistle or later this cannot happen
                    // (it could have ran out of gas prior to getting here though)
                    if (gasLimit.gt(runState.eei.getGasLeft().isub(gas))) {
                        (0, _1.trap)(exceptions_1.ERROR.OUT_OF_GAS);
                    }
                    runState.messageGasLimit = gasLimit;
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* CREATE2 */
        0xf5,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _value, offset, length, _salt, initCodeCost, gasLimit;
                return __generator(this, function (_b) {
                    if (runState.eei.isStatic()) {
                        (0, _1.trap)(exceptions_1.ERROR.STATIC_STATE_CHANGE);
                    }
                    _a = __read(runState.stack.peek(4), 4), _value = _a[0], offset = _a[1], length = _a[2], _salt = _a[3];
                    gas.iadd((0, _1.subMemUsage)(runState, offset, length, common));
                    if (common.isActivatedEIP(2929)) {
                        gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, runState.eei.getAddress(), common, false));
                    }
                    gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'sha3Word')).imul((0, _1.divCeil)(length, new ethereumjs_util_1.BN(32))));
                    if (common.isActivatedEIP(3860)) {
                        initCodeCost = new ethereumjs_util_1.BN(common.param('gasPrices', 'initCodeWordCost')).imul(length.addn(31).divn(32));
                        gas.iadd(initCodeCost);
                    }
                    gasLimit = new ethereumjs_util_1.BN(runState.eei.getGasLeft().isub(gas));
                    gasLimit = (0, _1.maxCallGas)(gasLimit.clone(), gasLimit.clone(), runState, common); // CREATE2 is only available after TangerineWhistle (Constantinople introduced this opcode)
                    runState.messageGasLimit = gasLimit;
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* STATICCALL */
        0xfa,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, currentGasLimit, toAddr, inOffset, inLength, outOffset, outLength, toAddress, gasLimit;
                return __generator(this, function (_b) {
                    _a = __read(runState.stack.peek(6), 6), currentGasLimit = _a[0], toAddr = _a[1], inOffset = _a[2], inLength = _a[3], outOffset = _a[4], outLength = _a[5];
                    gas.iadd((0, _1.subMemUsage)(runState, inOffset, inLength, common));
                    gas.iadd((0, _1.subMemUsage)(runState, outOffset, outLength, common));
                    if (common.isActivatedEIP(2929)) {
                        toAddress = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(toAddr));
                        gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, toAddress, common));
                    }
                    gasLimit = (0, _1.maxCallGas)(currentGasLimit.clone(), runState.eei.getGasLeft().isub(gas), runState, common) // we set TangerineWhistle or later to true here, as STATICCALL was available from Byzantium (which is after TangerineWhistle)
                    ;
                    runState.messageGasLimit = gasLimit;
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* REVERT */
        0xfd,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, offset, length;
                return __generator(this, function (_b) {
                    _a = __read(runState.stack.peek(2), 2), offset = _a[0], length = _a[1];
                    gas.iadd((0, _1.subMemUsage)(runState, offset, length, common));
                    return [2 /*return*/];
                });
            });
        },
    ],
    [
        /* SELFDESTRUCT */
        0xff,
        function (runState, gas, common) {
            return __awaiter(this, void 0, void 0, function () {
                var selfdestructToAddressBN, selfdestructToAddress, deductGas, balance, empty, exists;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (runState.eei.isStatic()) {
                                (0, _1.trap)(exceptions_1.ERROR.STATIC_STATE_CHANGE);
                            }
                            selfdestructToAddressBN = runState.stack.peek()[0];
                            selfdestructToAddress = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(selfdestructToAddressBN));
                            deductGas = false;
                            if (!common.gteHardfork('spuriousDragon')) return [3 /*break*/, 4];
                            return [4 /*yield*/, runState.eei.getExternalBalance(runState.eei.getAddress())];
                        case 1:
                            balance = _a.sent();
                            if (!balance.gtn(0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, runState.eei.isAccountEmpty(selfdestructToAddress)];
                        case 2:
                            empty = _a.sent();
                            if (empty) {
                                deductGas = true;
                            }
                            _a.label = 3;
                        case 3: return [3 /*break*/, 6];
                        case 4:
                            if (!common.gteHardfork('tangerineWhistle')) return [3 /*break*/, 6];
                            return [4 /*yield*/, runState.stateManager.accountExists(selfdestructToAddress)];
                        case 5:
                            exists = _a.sent();
                            if (!exists) {
                                deductGas = true;
                            }
                            _a.label = 6;
                        case 6:
                            if (deductGas) {
                                gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'callNewAccount')));
                            }
                            if (common.isActivatedEIP(2929)) {
                                gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, selfdestructToAddress, common, true, true));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
    ],
]);
// Set the range [0xa0, 0xa4] to the LOG handler
var logDynamicFunc = exports.dynamicGasHandlers.get(0xa0);
for (var i = 0xa1; i <= 0xa4; i++) {
    exports.dynamicGasHandlers.set(i, logDynamicFunc);
}
//# sourceMappingURL=gas.js.map