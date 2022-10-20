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
exports.VmErrorResult = exports.INVALID_EOF_RESULT = exports.INVALID_BYTECODE_RESULT = exports.COOGResult = exports.OOGResult = void 0;
const debug_1 = require("debug");
const ethereumjs_util_1 = require("ethereumjs-util");
const block_1 = require("@ethereumjs/block");
const exceptions_1 = require("../exceptions");
const eei_1 = __importDefault(require("./eei"));
// eslint-disable-next-line
const util_1 = require("./opcodes/util");
const eof = __importStar(require("./opcodes/eof"));
const interpreter_1 = __importDefault(require("./interpreter"));
const state_1 = require("../state");
const debug = (0, debug_1.debug)('vm:evm');
const debugGas = (0, debug_1.debug)('vm:evm:gas');
function OOGResult(gasLimit) {
    return {
        returnValue: Buffer.alloc(0),
        gasUsed: gasLimit,
        exceptionError: new exceptions_1.VmError(exceptions_1.ERROR.OUT_OF_GAS),
    };
}
exports.OOGResult = OOGResult;
// CodeDeposit OOG Result
function COOGResult(gasUsedCreateCode) {
    return {
        returnValue: Buffer.alloc(0),
        gasUsed: gasUsedCreateCode,
        exceptionError: new exceptions_1.VmError(exceptions_1.ERROR.CODESTORE_OUT_OF_GAS),
    };
}
exports.COOGResult = COOGResult;
function INVALID_BYTECODE_RESULT(gasLimit) {
    return {
        returnValue: Buffer.alloc(0),
        gasUsed: gasLimit,
        exceptionError: new exceptions_1.VmError(exceptions_1.ERROR.INVALID_BYTECODE_RESULT),
    };
}
exports.INVALID_BYTECODE_RESULT = INVALID_BYTECODE_RESULT;
function INVALID_EOF_RESULT(gasLimit) {
    return {
        returnValue: Buffer.alloc(0),
        gasUsed: gasLimit,
        exceptionError: new exceptions_1.VmError(exceptions_1.ERROR.INVALID_EOF_FORMAT),
    };
}
exports.INVALID_EOF_RESULT = INVALID_EOF_RESULT;
function VmErrorResult(error, gasUsed) {
    return {
        returnValue: Buffer.alloc(0),
        gasUsed: gasUsed,
        exceptionError: error,
    };
}
exports.VmErrorResult = VmErrorResult;
/**
 * EVM is responsible for executing an EVM message fully
 * (including any nested calls and creates), processing the results
 * and storing them to state (or discarding changes in case of exceptions).
 * @ignore
 */
class EVM {
    constructor(vm, txContext, block) {
        this._vm = vm;
        this._state = this._vm.stateManager;
        this._tx = txContext;
        this._block = block;
        this._refund = new ethereumjs_util_1.BN(0);
        this._transientStorage = new state_1.TransientStorage();
    }
    /**
     * Executes an EVM message, determining whether it's a call or create
     * based on the `to` address. It checkpoints the state and reverts changes
     * if an exception happens during the message execution.
     */
    async executeMessage(message) {
        var _a;
        await this._vm._emit('beforeMessage', message);
        if (!message.to && this._vm._common.isActivatedEIP(2929)) {
            message.code = message.data;
            this._state.addWarmedAddress((await this._generateAddress(message)).buf);
        }
        const oldRefund = this._refund.clone();
        await this._state.checkpoint();
        this._transientStorage.checkpoint();
        if (this._vm.DEBUG) {
            debug('-'.repeat(100));
            debug(`message checkpoint`);
        }
        let result;
        if (this._vm.DEBUG) {
            const { caller, gasLimit, to, value, delegatecall } = message;
            debug(`New message caller=${caller} gasLimit=${gasLimit} to=${(_a = to === null || to === void 0 ? void 0 : to.toString()) !== null && _a !== void 0 ? _a : 'none'} value=${value} delegatecall=${delegatecall ? 'yes' : 'no'}`);
        }
        if (message.to) {
            if (this._vm.DEBUG) {
                debug(`Message CALL execution (to: ${message.to})`);
            }
            result = await this._executeCall(message);
        }
        else {
            if (this._vm.DEBUG) {
                debug(`Message CREATE execution (to undefined)`);
            }
            result = await this._executeCreate(message);
        }
        if (this._vm.DEBUG) {
            const { gasUsed, exceptionError, returnValue, gasRefund } = result.execResult;
            debug(`Received message execResult: [ gasUsed=${gasUsed} exceptionError=${exceptionError ? `'${exceptionError.error}'` : 'none'} returnValue=0x${(0, util_1.short)(returnValue)} gasRefund=${gasRefund !== null && gasRefund !== void 0 ? gasRefund : 0} ]`);
        }
        const err = result.execResult.exceptionError;
        // This clause captures any error which happened during execution
        // If that is the case, then set the _refund tracker to the old refund value
        if (err) {
            // TODO: Move `gasRefund` to a tx-level result object
            // instead of `ExecResult`.
            this._refund = oldRefund;
            result.execResult.selfdestruct = {};
        }
        result.execResult.gasRefund = this._refund.clone();
        if (err) {
            if (this._vm._common.gteHardfork('homestead') || err.error != exceptions_1.ERROR.CODESTORE_OUT_OF_GAS) {
                result.execResult.logs = [];
                await this._state.revert();
                this._transientStorage.revert();
                if (this._vm.DEBUG) {
                    debug(`message checkpoint reverted`);
                }
            }
            else {
                // we are in chainstart and the error was the code deposit error
                // we do like nothing happened.
                await this._state.commit();
                this._transientStorage.commit();
                if (this._vm.DEBUG) {
                    debug(`message checkpoint committed`);
                }
            }
        }
        else {
            await this._state.commit();
            this._transientStorage.commit();
            if (this._vm.DEBUG) {
                debug(`message checkpoint committed`);
            }
        }
        await this._vm._emit('afterMessage', result);
        return result;
    }
    async _executeCall(message) {
        const account = await this._state.getAccount(message.caller);
        // Reduce tx value from sender
        if (!message.delegatecall) {
            await this._reduceSenderBalance(account, message);
        }
        // Load `to` account
        const toAccount = await this._state.getAccount(message.to);
        // Add tx value to the `to` account
        let errorMessage;
        if (!message.delegatecall) {
            try {
                await this._addToBalance(toAccount, message);
            }
            catch (e) {
                errorMessage = e;
            }
        }
        // Load code
        await this._loadCode(message);
        let exit = false;
        if (!message.code || message.code.length === 0) {
            exit = true;
            if (this._vm.DEBUG) {
                debug(`Exit early on no code`);
            }
        }
        if (errorMessage) {
            exit = true;
            if (this._vm.DEBUG) {
                debug(`Exit early on value transfer overflowed`);
            }
        }
        if (exit) {
            return {
                gasUsed: new ethereumjs_util_1.BN(0),
                execResult: {
                    gasUsed: new ethereumjs_util_1.BN(0),
                    exceptionError: errorMessage,
                    returnValue: Buffer.alloc(0),
                },
            };
        }
        let result;
        if (message.isCompiled) {
            if (this._vm.DEBUG) {
                debug(`Run precompile`);
            }
            result = await this.runPrecompile(message.code, message.data, message.gasLimit);
        }
        else {
            if (this._vm.DEBUG) {
                debug(`Start bytecode processing...`);
            }
            result = await this.runInterpreter(message);
        }
        return {
            gasUsed: result.gasUsed,
            execResult: result,
        };
    }
    async _executeCreate(message) {
        const account = await this._state.getAccount(message.caller);
        // Reduce tx value from sender
        await this._reduceSenderBalance(account, message);
        if (this._vm._common.isActivatedEIP(3860)) {
            if (message.data.length > this._vm._common.param('vm', 'maxInitCodeSize')) {
                return {
                    gasUsed: message.gasLimit,
                    createdAddress: message.to,
                    execResult: {
                        returnValue: Buffer.alloc(0),
                        exceptionError: new exceptions_1.VmError(exceptions_1.ERROR.INITCODE_SIZE_VIOLATION),
                        gasUsed: message.gasLimit,
                    },
                };
            }
        }
        message.code = message.data;
        message.data = Buffer.alloc(0);
        message.to = await this._generateAddress(message);
        if (this._vm.DEBUG) {
            debug(`Generated CREATE contract address ${message.to}`);
        }
        let toAccount = await this._state.getAccount(message.to);
        // Check for collision
        if ((toAccount.nonce && toAccount.nonce.gtn(0)) || !toAccount.codeHash.equals(ethereumjs_util_1.KECCAK256_NULL)) {
            if (this._vm.DEBUG) {
                debug(`Returning on address collision`);
            }
            return {
                gasUsed: message.gasLimit,
                createdAddress: message.to,
                execResult: {
                    returnValue: Buffer.alloc(0),
                    exceptionError: new exceptions_1.VmError(exceptions_1.ERROR.CREATE_COLLISION),
                    gasUsed: message.gasLimit,
                },
            };
        }
        await this._state.clearContractStorage(message.to);
        const newContractEvent = {
            address: message.to,
            code: message.code,
        };
        await this._vm._emit('newContract', newContractEvent);
        toAccount = await this._state.getAccount(message.to);
        // EIP-161 on account creation and CREATE execution
        if (this._vm._common.gteHardfork('spuriousDragon')) {
            toAccount.nonce.iaddn(1);
        }
        // Add tx value to the `to` account
        let errorMessage;
        try {
            await this._addToBalance(toAccount, message);
        }
        catch (e) {
            errorMessage = e;
        }
        let exit = false;
        if (!message.code || message.code.length === 0) {
            exit = true;
            if (this._vm.DEBUG) {
                debug(`Exit early on no code`);
            }
        }
        if (errorMessage) {
            exit = true;
            if (this._vm.DEBUG) {
                debug(`Exit early on value transfer overflowed`);
            }
        }
        if (exit) {
            return {
                gasUsed: new ethereumjs_util_1.BN(0),
                createdAddress: message.to,
                execResult: {
                    gasUsed: new ethereumjs_util_1.BN(0),
                    exceptionError: errorMessage,
                    returnValue: Buffer.alloc(0),
                },
            };
        }
        if (this._vm.DEBUG) {
            debug(`Start bytecode processing...`);
        }
        let result = await this.runInterpreter(message);
        // fee for size of the return value
        let totalGas = result.gasUsed;
        let returnFee = new ethereumjs_util_1.BN(0);
        if (!result.exceptionError) {
            returnFee = new ethereumjs_util_1.BN(result.returnValue.length).imuln(this._vm._common.param('gasPrices', 'createData'));
            totalGas = totalGas.add(returnFee);
            if (this._vm.DEBUG) {
                debugGas(`Add return value size fee (${returnFee} to gas used (-> ${totalGas}))`);
            }
        }
        // Check for SpuriousDragon EIP-170 code size limit
        let allowedCodeSize = true;
        if (!result.exceptionError &&
            this._vm._common.gteHardfork('spuriousDragon') &&
            result.returnValue.length > this._vm._common.param('vm', 'maxCodeSize')) {
            allowedCodeSize = false;
        }
        // If enough gas and allowed code size
        let CodestoreOOG = false;
        if (totalGas.lte(message.gasLimit) &&
            (this._vm._allowUnlimitedContractSize || allowedCodeSize)) {
            if (this._vm._common.isActivatedEIP(3541) && result.returnValue[0] === eof.FORMAT) {
                if (!this._vm._common.isActivatedEIP(3540)) {
                    result = Object.assign(Object.assign({}, result), INVALID_BYTECODE_RESULT(message.gasLimit));
                }
                // Begin EOF1 contract code checks
                // EIP-3540 EOF1 header check
                const eof1CodeAnalysisResults = eof.codeAnalysis(result.returnValue);
                if (!(eof1CodeAnalysisResults === null || eof1CodeAnalysisResults === void 0 ? void 0 : eof1CodeAnalysisResults.code)) {
                    result = Object.assign(Object.assign({}, result), INVALID_EOF_RESULT(message.gasLimit));
                }
                else if (this._vm._common.isActivatedEIP(3670)) {
                    // EIP-3670 EOF1 opcode check
                    const codeStart = eof1CodeAnalysisResults.data > 0 ? 10 : 7;
                    // The start of the code section of an EOF1 compliant contract will either be
                    // index 7 (if no data section is present) or index 10 (if a data section is present)
                    // in the bytecode of the contract
                    if (!eof.validOpcodes(result.returnValue.slice(codeStart, codeStart + eof1CodeAnalysisResults.code))) {
                        result = Object.assign(Object.assign({}, result), INVALID_EOF_RESULT(message.gasLimit));
                    }
                    else {
                        result.gasUsed = totalGas;
                    }
                }
            }
            else {
                result.gasUsed = totalGas;
            }
        }
        else {
            if (this._vm._common.gteHardfork('homestead')) {
                if (this._vm.DEBUG) {
                    debug(`Not enough gas or code size not allowed (>= Homestead)`);
                }
                result = Object.assign(Object.assign({}, result), OOGResult(message.gasLimit));
            }
            else {
                // we are in Frontier
                if (this._vm.DEBUG) {
                    debug(`Not enough gas or code size not allowed (Frontier)`);
                }
                if (totalGas.sub(returnFee).lte(message.gasLimit)) {
                    // we cannot pay the code deposit fee (but the deposit code actually did run)
                    result = Object.assign(Object.assign({}, result), COOGResult(totalGas.sub(returnFee)));
                    CodestoreOOG = true;
                }
                else {
                    result = Object.assign(Object.assign({}, result), OOGResult(message.gasLimit));
                }
            }
        }
        // Save code if a new contract was created
        if (!result.exceptionError && result.returnValue && result.returnValue.toString() !== '') {
            await this._state.putContractCode(message.to, result.returnValue);
            if (this._vm.DEBUG) {
                debug(`Code saved on new contract creation`);
            }
        }
        else if (CodestoreOOG) {
            // This only happens at Frontier. But, let's do a sanity check;
            if (!this._vm._common.gteHardfork('homestead')) {
                // Pre-Homestead behavior; put an empty contract.
                // This contract would be considered "DEAD" in later hard forks.
                // It is thus an unecessary default item, which we have to save to dik
                // It does change the state root, but it only wastes storage.
                //await this._state.putContractCode(message.to, result.returnValue)
                const account = await this._state.getAccount(message.to);
                await this._state.putAccount(message.to, account);
            }
        }
        return {
            gasUsed: result.gasUsed,
            createdAddress: message.to,
            execResult: result,
        };
    }
    /**
     * Starts the actual bytecode processing for a CALL or CREATE, providing
     * it with the {@link EEI}.
     */
    async runInterpreter(message, opts = {}) {
        const env = {
            blockchain: this._vm.blockchain,
            address: message.to || ethereumjs_util_1.Address.zero(),
            caller: message.caller || ethereumjs_util_1.Address.zero(),
            callData: message.data || Buffer.from([0]),
            callValue: message.value || new ethereumjs_util_1.BN(0),
            code: message.code,
            isStatic: message.isStatic || false,
            depth: message.depth || 0,
            gasPrice: this._tx.gasPrice,
            origin: this._tx.origin || message.caller || ethereumjs_util_1.Address.zero(),
            block: this._block || new block_1.Block(),
            contract: await this._state.getAccount(message.to || ethereumjs_util_1.Address.zero()),
            codeAddress: message.codeAddress,
        };
        const eei = new eei_1.default(env, this._state, this, this._vm._common, message.gasLimit.clone(), this._transientStorage);
        if (message.selfdestruct) {
            eei._result.selfdestruct = message.selfdestruct;
        }
        const interpreter = new interpreter_1.default(this._vm, eei);
        const interpreterRes = await interpreter.run(message.code, opts);
        let result = eei._result;
        let gasUsed = message.gasLimit.sub(eei._gasLeft);
        if (interpreterRes.exceptionError) {
            if (interpreterRes.exceptionError.error !== exceptions_1.ERROR.REVERT &&
                interpreterRes.exceptionError.error !== exceptions_1.ERROR.INVALID_EOF_FORMAT) {
                gasUsed = message.gasLimit;
            }
            // Clear the result on error
            result = Object.assign(Object.assign({}, result), { logs: [], selfdestruct: {} });
        }
        return Object.assign(Object.assign({}, result), { runState: Object.assign(Object.assign(Object.assign({}, interpreterRes.runState), result), eei._env), exceptionError: interpreterRes.exceptionError, gas: eei._gasLeft, gasUsed, returnValue: result.returnValue ? result.returnValue : Buffer.alloc(0) });
    }
    /**
     * Returns code for precompile at the given address, or undefined
     * if no such precompile exists.
     */
    getPrecompile(address) {
        return this._vm.precompiles.get(address.buf.toString('hex'));
    }
    /**
     * Executes a precompiled contract with given data and gas limit.
     */
    runPrecompile(code, data, gasLimit) {
        if (typeof code !== 'function') {
            throw new Error('Invalid precompile');
        }
        const opts = {
            data,
            gasLimit,
            _common: this._vm._common,
            _VM: this._vm,
        };
        return code(opts);
    }
    async _loadCode(message) {
        if (!message.code) {
            const precompile = this.getPrecompile(message.codeAddress);
            if (precompile) {
                message.code = precompile;
                message.isCompiled = true;
            }
            else {
                message.code = await this._state.getContractCode(message.codeAddress);
                message.isCompiled = false;
            }
        }
    }
    async _generateAddress(message) {
        let addr;
        if (message.salt) {
            addr = (0, ethereumjs_util_1.generateAddress2)(message.caller.buf, message.salt, message.code);
        }
        else {
            const acc = await this._state.getAccount(message.caller);
            const newNonce = acc.nonce.subn(1);
            addr = (0, ethereumjs_util_1.generateAddress)(message.caller.buf, newNonce.toArrayLike(Buffer));
        }
        return new ethereumjs_util_1.Address(addr);
    }
    async _reduceSenderBalance(account, message) {
        account.balance.isub(message.value);
        const result = this._state.putAccount(message.caller, account);
        if (this._vm.DEBUG) {
            debug(`Reduced sender (${message.caller}) balance (-> ${account.balance})`);
        }
        return result;
    }
    async _addToBalance(toAccount, message) {
        const newBalance = toAccount.balance.add(message.value);
        if (newBalance.gt(ethereumjs_util_1.MAX_INTEGER)) {
            throw new exceptions_1.VmError(exceptions_1.ERROR.VALUE_OVERFLOW);
        }
        toAccount.balance = newBalance;
        // putAccount as the nonce may have changed for contract creation
        const result = this._state.putAccount(message.to, toAccount);
        if (this._vm.DEBUG) {
            debug(`Added toAccount (${message.to}) balance (-> ${toAccount.balance})`);
        }
        return result;
    }
    async _touchAccount(address) {
        const account = await this._state.getAccount(address);
        return this._state.putAccount(address, account);
    }
}
exports.default = EVM;
//# sourceMappingURL=evm.js.map