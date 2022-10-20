/// <reference types="node" />
import { OpHandler } from './opcodes';
import { AsyncDynamicGasHandler, SyncDynamicGasHandler } from './opcodes/gas';
/**
 * Log that the contract emitted.
 */
export declare type Log = [address: Buffer, topics: Buffer[], data: Buffer];
export declare type DeleteOpcode = {
    opcode: number;
};
export declare type AddOpcode = {
    opcode: number;
    opcodeName: string;
    baseFee: number;
    gasFunction?: AsyncDynamicGasHandler | SyncDynamicGasHandler;
    logicFunction: OpHandler;
};
export declare type CustomOpcode = AddOpcode | DeleteOpcode;
