/// <reference types="bn.js" />
import { BN } from 'ethereumjs-util';
import { RunState } from '../interpreter';
import Common from '@ethereumjs/common';
/**
 * This file returns the dynamic parts of opcodes which have dynamic gas
 * These are not pure functions: some edit the size of the memory
 * These functions are therefore not read-only
 */
export interface AsyncDynamicGasHandler {
    (runState: RunState, gas: BN, common: Common): Promise<void>;
}
export interface SyncDynamicGasHandler {
    (runState: RunState, gas: BN, common: Common): void;
}
export declare const dynamicGasHandlers: Map<number, AsyncDynamicGasHandler | SyncDynamicGasHandler>;
