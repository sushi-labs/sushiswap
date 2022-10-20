"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = require("debug");
var ethereumjs_util_1 = require("ethereumjs-util");
var exceptions_1 = require("../exceptions");
var memory_1 = __importDefault(require("./memory"));
var stack_1 = __importDefault(require("./stack"));
var eof = __importStar(require("./opcodes/eof"));
/**
 * Parses and executes EVM bytecode.
 */
var Interpreter = /** @class */ (function () {
    function Interpreter(vm, eei) {
        // Opcode debuggers (e.g. { 'push': [debug Object], 'sstore': [debug Object], ...})
        this.opDebuggers = {};
        this._vm = vm;
        this._state = vm.stateManager;
        this._eei = eei;
        this._runState = {
            programCounter: 0,
            opCode: 0xfe,
            memory: new memory_1.default(),
            memoryWordCount: new ethereumjs_util_1.BN(0),
            highestMemCost: new ethereumjs_util_1.BN(0),
            stack: new stack_1.default(),
            returnStack: new stack_1.default(1023),
            code: Buffer.alloc(0),
            validJumps: Uint8Array.from([]),
            stateManager: this._state,
            eei: this._eei,
            shouldDoJumpAnalysis: true,
        };
    }
    Interpreter.prototype.run = function (code, opts) {
        var _a;
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var codeSections, pc, err, opCode, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this._vm._common.isActivatedEIP(3540) || code[0] !== eof.FORMAT) {
                            // EIP-3540 isn't active and first byte is not 0xEF - treat as legacy bytecode
                            this._runState.code = code;
                        }
                        else if (this._vm._common.isActivatedEIP(3540)) {
                            if (code[1] !== eof.MAGIC) {
                                // Bytecode contains invalid EOF magic byte
                                return [2 /*return*/, {
                                        runState: this._runState,
                                        exceptionError: new exceptions_1.VmError(exceptions_1.ERROR.INVALID_BYTECODE_RESULT),
                                    }];
                            }
                            if (code[2] !== eof.VERSION) {
                                // Bytecode contains invalid EOF version number
                                return [2 /*return*/, {
                                        runState: this._runState,
                                        exceptionError: new exceptions_1.VmError(exceptions_1.ERROR.INVALID_EOF_FORMAT),
                                    }];
                            }
                            codeSections = eof.codeAnalysis(code);
                            if (!codeSections) {
                                // Code is invalid EOF1 format if `codeSections` is falsy
                                return [2 /*return*/, {
                                        runState: this._runState,
                                        exceptionError: new exceptions_1.VmError(exceptions_1.ERROR.INVALID_EOF_FORMAT),
                                    }];
                            }
                            if (codeSections.data) {
                                // Set code to EOF container code section which starts at byte position 10 if data section is present
                                this._runState.code = code.slice(10, 10 + codeSections.code);
                            }
                            else {
                                // Set code to EOF container code section which starts at byte position 7 if no data section is present
                                this._runState.code = code.slice(7, 7 + codeSections.code);
                            }
                        }
                        this._runState.programCounter = (_a = opts.pc) !== null && _a !== void 0 ? _a : this._runState.programCounter;
                        pc = this._runState.programCounter;
                        if (pc !== 0 && (pc < 0 || pc >= this._runState.code.length)) {
                            throw new Error('Internal error: program counter not in range');
                        }
                        _b.label = 1;
                    case 1:
                        if (!(this._runState.programCounter < this._runState.code.length)) return [3 /*break*/, 6];
                        opCode = this._runState.code[this._runState.programCounter];
                        if (this._runState.shouldDoJumpAnalysis &&
                            (opCode === 0x56 || opCode === 0x57 || opCode === 0x5e)) {
                            // Only run the jump destination analysis if `code` actually contains a JUMP/JUMPI/JUMPSUB opcode
                            this._runState.validJumps = this._getValidJumpDests(this._runState.code);
                            this._runState.shouldDoJumpAnalysis = false;
                        }
                        this._runState.opCode = opCode;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.runStep()];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        // re-throw on non-VM errors
                        if (!('errorType' in e_1 && e_1.errorType === 'VmError')) {
                            throw e_1;
                        }
                        // STOP is not an exception
                        if (e_1.error !== exceptions_1.ERROR.STOP) {
                            err = e_1;
                        }
                        return [3 /*break*/, 6];
                    case 5: return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, {
                            runState: this._runState,
                            exceptionError: err,
                        }];
                }
            });
        });
    };
    /**
     * Executes the opcode to which the program counter is pointing,
     * reducing its base gas cost, and increments the program counter.
     */
    Interpreter.prototype.runStep = function () {
        return __awaiter(this, void 0, void 0, function () {
            var opInfo, gas, gasLimitClone, dynamicGasHandler, opFn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opInfo = this.lookupOpInfo(this._runState.opCode);
                        gas = new ethereumjs_util_1.BN(opInfo.fee);
                        gasLimitClone = this._eei.getGasLeft();
                        if (!opInfo.dynamicGas) return [3 /*break*/, 2];
                        dynamicGasHandler = this._vm._dynamicGasHandlers.get(this._runState.opCode);
                        // This function updates the gas BN in-place using `i*` methods
                        // It needs the base fee, for correct gas limit calculation for the CALL opcodes
                        return [4 /*yield*/, dynamicGasHandler(this._runState, gas, this._vm._common)];
                    case 1:
                        // This function updates the gas BN in-place using `i*` methods
                        // It needs the base fee, for correct gas limit calculation for the CALL opcodes
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(this._vm.listenerCount('step') > 0 || this._vm.DEBUG)) return [3 /*break*/, 4];
                        // Only run this stepHook function if there is an event listener (e.g. test runner)
                        // or if the vm is running in debug mode (to display opcode debug logs)
                        return [4 /*yield*/, this._runStepHook(gas, gasLimitClone)];
                    case 3:
                        // Only run this stepHook function if there is an event listener (e.g. test runner)
                        // or if the vm is running in debug mode (to display opcode debug logs)
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        // Check for invalid opcode
                        if (opInfo.name === 'INVALID') {
                            throw new exceptions_1.VmError(exceptions_1.ERROR.INVALID_OPCODE);
                        }
                        // Reduce opcode's base fee
                        this._eei.useGas(gas, "".concat(opInfo.name, " fee"));
                        // Advance program counter
                        this._runState.programCounter++;
                        opFn = this.getOpHandler(opInfo);
                        if (!opInfo.isAsync) return [3 /*break*/, 6];
                        return [4 /*yield*/, opFn.apply(null, [this._runState, this._vm._common])];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        opFn.apply(null, [this._runState, this._vm._common]);
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the handler function for an opcode.
     */
    Interpreter.prototype.getOpHandler = function (opInfo) {
        return this._vm._handlers.get(opInfo.code);
    };
    /**
     * Get info for an opcode from VM's list of opcodes.
     */
    Interpreter.prototype.lookupOpInfo = function (op) {
        var _a;
        // if not found, return 0xfe: INVALID
        return (_a = this._vm._opcodes.get(op)) !== null && _a !== void 0 ? _a : this._vm._opcodes.get(0xfe);
    };
    Interpreter.prototype._runStepHook = function (dynamicFee, gasLeft) {
        return __awaiter(this, void 0, void 0, function () {
            var opcode, eventObj, hexStack, name_1, opTrace;
            return __generator(this, function (_a) {
                opcode = this.lookupOpInfo(this._runState.opCode);
                eventObj = {
                    pc: this._runState.programCounter,
                    gasLeft: gasLeft,
                    gasRefund: this._eei._evm._refund,
                    opcode: {
                        name: opcode.fullName,
                        fee: opcode.fee,
                        dynamicFee: dynamicFee,
                        isAsync: opcode.isAsync,
                    },
                    stack: this._runState.stack._store,
                    returnStack: this._runState.returnStack._store,
                    depth: this._eei._env.depth,
                    address: this._eei._env.address,
                    account: this._eei._env.contract,
                    stateManager: this._runState.stateManager,
                    memory: this._runState.memory._store,
                    memoryWordCount: this._runState.memoryWordCount,
                    codeAddress: this._eei._env.codeAddress,
                };
                if (this._vm.DEBUG) {
                    hexStack = [];
                    hexStack = eventObj.stack.map(function (item) {
                        return '0x' + new ethereumjs_util_1.BN(item).toString(16, 0);
                    });
                    name_1 = eventObj.opcode.name;
                    opTrace = {
                        pc: eventObj.pc,
                        op: name_1,
                        gas: '0x' + eventObj.gasLeft.toString('hex'),
                        gasCost: '0x' + eventObj.opcode.fee.toString(16),
                        stack: hexStack,
                        depth: eventObj.depth,
                    };
                    if (!(name_1 in this.opDebuggers)) {
                        this.opDebuggers[name_1] = (0, debug_1.debug)("vm:ops:".concat(name_1));
                    }
                    this.opDebuggers[name_1](JSON.stringify(opTrace));
                }
                /**
                 * The `step` event for trace output
                 *
                 * @event Event: step
                 * @type {Object}
                 * @property {Number} pc representing the program counter
                 * @property {Object} opcode the next opcode to be ran
                 * @property {string}     opcode.name
                 * @property {fee}        opcode.number Base fee of the opcode
                 * @property {dynamicFee} opcode.dynamicFee Dynamic opcode fee
                 * @property {boolean}    opcode.isAsync opcode is async
                 * @property {BN} gasLeft amount of gasLeft
                 * @property {BN} gasRefund gas refund
                 * @property {StateManager} stateManager a {@link StateManager} instance
                 * @property {Array} stack an `Array` of `Buffers` containing the stack
                 * @property {Array} returnStack the return stack
                 * @property {Account} account the Account which owns the code running
                 * @property {Address} address the address of the `account`
                 * @property {Number} depth the current number of calls deep the contract is
                 * @property {Buffer} memory the memory of the VM as a `buffer`
                 * @property {BN} memoryWordCount current size of memory in words
                 * @property {Address} codeAddress the address of the code which is currently being ran (this differs from `address` in a `DELEGATECALL` and `CALLCODE` call)
                 */
                return [2 /*return*/, this._vm._emit('step', eventObj)];
            });
        });
    };
    // Returns all valid jump and jumpsub destinations.
    Interpreter.prototype._getValidJumpDests = function (code) {
        var jumps = new Uint8Array(code.length).fill(0);
        for (var i = 0; i < code.length; i++) {
            var opcode = code[i];
            // skip over PUSH0-32 since no jump destinations in the middle of a push block
            if (opcode <= 0x7f) {
                if (opcode >= 0x60) {
                    i += opcode - 0x5f;
                }
                else if (opcode === 0x5b) {
                    // Define a JUMPDEST as a 1 in the valid jumps array
                    jumps[i] = 1;
                }
                else if (opcode === 0x5c) {
                    // Define a BEGINSUB as a 2 in the valid jumps array
                    jumps[i] = 2;
                }
            }
        }
        return jumps;
    };
    return Interpreter;
}());
exports.default = Interpreter;
//# sourceMappingURL=interpreter.js.map