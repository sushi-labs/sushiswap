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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const ethereumjs_util_1 = require("ethereumjs-util");
const exceptions_1 = require("../exceptions");
const memory_1 = __importDefault(require("./memory"));
const stack_1 = __importDefault(require("./stack"));
const eof = __importStar(require("./opcodes/eof"));
/**
 * Parses and executes EVM bytecode.
 */
class Interpreter {
    constructor(vm, eei) {
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
    async run(code, opts = {}) {
        var _a;
        if (!this._vm._common.isActivatedEIP(3540) || code[0] !== eof.FORMAT) {
            // EIP-3540 isn't active and first byte is not 0xEF - treat as legacy bytecode
            this._runState.code = code;
        }
        else if (this._vm._common.isActivatedEIP(3540)) {
            if (code[1] !== eof.MAGIC) {
                // Bytecode contains invalid EOF magic byte
                return {
                    runState: this._runState,
                    exceptionError: new exceptions_1.VmError(exceptions_1.ERROR.INVALID_BYTECODE_RESULT),
                };
            }
            if (code[2] !== eof.VERSION) {
                // Bytecode contains invalid EOF version number
                return {
                    runState: this._runState,
                    exceptionError: new exceptions_1.VmError(exceptions_1.ERROR.INVALID_EOF_FORMAT),
                };
            }
            // Code is EOF1 format
            const codeSections = eof.codeAnalysis(code);
            if (!codeSections) {
                // Code is invalid EOF1 format if `codeSections` is falsy
                return {
                    runState: this._runState,
                    exceptionError: new exceptions_1.VmError(exceptions_1.ERROR.INVALID_EOF_FORMAT),
                };
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
        // Check that the programCounter is in range
        const pc = this._runState.programCounter;
        if (pc !== 0 && (pc < 0 || pc >= this._runState.code.length)) {
            throw new Error('Internal error: program counter not in range');
        }
        let err;
        // Iterate through the given ops until something breaks or we hit STOP
        while (this._runState.programCounter < this._runState.code.length) {
            const opCode = this._runState.code[this._runState.programCounter];
            if (this._runState.shouldDoJumpAnalysis &&
                (opCode === 0x56 || opCode === 0x57 || opCode === 0x5e)) {
                // Only run the jump destination analysis if `code` actually contains a JUMP/JUMPI/JUMPSUB opcode
                this._runState.validJumps = this._getValidJumpDests(this._runState.code);
                this._runState.shouldDoJumpAnalysis = false;
            }
            this._runState.opCode = opCode;
            try {
                await this.runStep();
            }
            catch (e) {
                // re-throw on non-VM errors
                if (!('errorType' in e && e.errorType === 'VmError')) {
                    throw e;
                }
                // STOP is not an exception
                if (e.error !== exceptions_1.ERROR.STOP) {
                    err = e;
                }
                break;
            }
        }
        return {
            runState: this._runState,
            exceptionError: err,
        };
    }
    /**
     * Executes the opcode to which the program counter is pointing,
     * reducing its base gas cost, and increments the program counter.
     */
    async runStep() {
        const opInfo = this.lookupOpInfo(this._runState.opCode);
        const gas = new ethereumjs_util_1.BN(opInfo.fee);
        // clone the gas limit; call opcodes can add stipend,
        // which makes it seem like the gas left increases
        const gasLimitClone = this._eei.getGasLeft();
        if (opInfo.dynamicGas) {
            const dynamicGasHandler = this._vm._dynamicGasHandlers.get(this._runState.opCode);
            // This function updates the gas BN in-place using `i*` methods
            // It needs the base fee, for correct gas limit calculation for the CALL opcodes
            await dynamicGasHandler(this._runState, gas, this._vm._common);
        }
        if (this._vm.listenerCount('step') > 0 || this._vm.DEBUG) {
            // Only run this stepHook function if there is an event listener (e.g. test runner)
            // or if the vm is running in debug mode (to display opcode debug logs)
            await this._runStepHook(gas, gasLimitClone);
        }
        // Check for invalid opcode
        if (opInfo.name === 'INVALID') {
            throw new exceptions_1.VmError(exceptions_1.ERROR.INVALID_OPCODE);
        }
        // Reduce opcode's base fee
        this._eei.useGas(gas, `${opInfo.name} fee`);
        // Advance program counter
        this._runState.programCounter++;
        // Execute opcode handler
        const opFn = this.getOpHandler(opInfo);
        if (opInfo.isAsync) {
            await opFn.apply(null, [this._runState, this._vm._common]);
        }
        else {
            opFn.apply(null, [this._runState, this._vm._common]);
        }
    }
    /**
     * Get the handler function for an opcode.
     */
    getOpHandler(opInfo) {
        return this._vm._handlers.get(opInfo.code);
    }
    /**
     * Get info for an opcode from VM's list of opcodes.
     */
    lookupOpInfo(op) {
        var _a;
        // if not found, return 0xfe: INVALID
        return (_a = this._vm._opcodes.get(op)) !== null && _a !== void 0 ? _a : this._vm._opcodes.get(0xfe);
    }
    async _runStepHook(dynamicFee, gasLeft) {
        const opcode = this.lookupOpInfo(this._runState.opCode);
        const eventObj = {
            pc: this._runState.programCounter,
            gasLeft,
            gasRefund: this._eei._evm._refund,
            opcode: {
                name: opcode.fullName,
                fee: opcode.fee,
                dynamicFee,
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
            // Create opTrace for debug functionality
            let hexStack = [];
            hexStack = eventObj.stack.map((item) => {
                return '0x' + new ethereumjs_util_1.BN(item).toString(16, 0);
            });
            const name = eventObj.opcode.name;
            const opTrace = {
                pc: eventObj.pc,
                op: name,
                gas: '0x' + eventObj.gasLeft.toString('hex'),
                gasCost: '0x' + eventObj.opcode.fee.toString(16),
                stack: hexStack,
                depth: eventObj.depth,
            };
            if (!(name in this.opDebuggers)) {
                this.opDebuggers[name] = (0, debug_1.debug)(`vm:ops:${name}`);
            }
            this.opDebuggers[name](JSON.stringify(opTrace));
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
        return this._vm._emit('step', eventObj);
    }
    // Returns all valid jump and jumpsub destinations.
    _getValidJumpDests(code) {
        const jumps = new Uint8Array(code.length).fill(0);
        for (let i = 0; i < code.length; i++) {
            const opcode = code[i];
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
    }
}
exports.default = Interpreter;
//# sourceMappingURL=interpreter.js.map