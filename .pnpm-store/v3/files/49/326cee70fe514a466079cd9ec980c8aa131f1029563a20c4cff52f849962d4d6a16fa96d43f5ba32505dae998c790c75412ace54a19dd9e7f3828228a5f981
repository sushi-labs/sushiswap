/// <reference types="bn.js" />
/// <reference types="node" />
import { Account, Address, BN } from 'ethereumjs-util';
import { StateManager } from '../state/index';
import { VmError } from '../exceptions';
import Memory from './memory';
import Stack from './stack';
import EEI from './eei';
import { Opcode, OpHandler } from './opcodes';
export interface InterpreterOpts {
    pc?: number;
}
export interface RunState {
    programCounter: number;
    opCode: number;
    memory: Memory;
    memoryWordCount: BN;
    highestMemCost: BN;
    stack: Stack;
    returnStack: Stack;
    code: Buffer;
    shouldDoJumpAnalysis: boolean;
    validJumps: Uint8Array;
    stateManager: StateManager;
    eei: EEI;
    messageGasLimit?: BN;
}
export interface InterpreterResult {
    runState?: RunState;
    exceptionError?: VmError;
}
export interface InterpreterStep {
    pc: number;
    opcode: {
        name: string;
        fee: number;
        dynamicFee?: BN;
        isAsync: boolean;
    };
    gasLeft: BN;
    gasRefund: BN;
    stateManager: StateManager;
    stack: BN[];
    returnStack: BN[];
    account: Account;
    address: Address;
    depth: number;
    memory: Buffer;
    memoryWordCount: BN;
    codeAddress: Address;
}
/**
 * Parses and executes EVM bytecode.
 */
export default class Interpreter {
    _vm: any;
    _state: StateManager;
    _runState: RunState;
    _eei: EEI;
    private opDebuggers;
    constructor(vm: any, eei: EEI);
    run(code: Buffer, opts?: InterpreterOpts): Promise<InterpreterResult>;
    /**
     * Executes the opcode to which the program counter is pointing,
     * reducing its base gas cost, and increments the program counter.
     */
    runStep(): Promise<void>;
    /**
     * Get the handler function for an opcode.
     */
    getOpHandler(opInfo: Opcode): OpHandler;
    /**
     * Get info for an opcode from VM's list of opcodes.
     */
    lookupOpInfo(op: number): Opcode;
    _runStepHook(dynamicFee: BN, gasLeft: BN): Promise<void>;
    _getValidJumpDests(code: Buffer): Uint8Array;
}
