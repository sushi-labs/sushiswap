/// <reference types="node" />
/// <reference types="bn.js" />
import Common from '@ethereumjs/common';
import { BN } from 'ethereumjs-util';
import { RunState } from './../interpreter';
/**
 * Adjusts gas usage and refunds of SStore ops per EIP-2200 (Istanbul)
 *
 * @param {RunState} runState
 * @param {Buffer}   currentStorage
 * @param {Buffer}   originalStorage
 * @param {Buffer}   value
 * @param {Common}   common
 */
export declare function updateSstoreGasEIP2200(runState: RunState, currentStorage: Buffer, originalStorage: Buffer, value: Buffer, key: Buffer, common: Common): BN;
