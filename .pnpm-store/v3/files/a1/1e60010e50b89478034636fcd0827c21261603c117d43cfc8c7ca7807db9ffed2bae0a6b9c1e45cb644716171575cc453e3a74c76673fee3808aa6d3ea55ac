import type { ExtendedDictionary } from './types';
import type { Primitives } from '@edge-runtime/primitives';
import type { VMOptions } from './vm';
import { VM } from './vm';
export interface EdgeVMOptions<T> {
    /**
     * Provide code generation options to the Node.js VM.
     * If you don't provide any option, code generation will be disabled.
     */
    codeGeneration?: VMOptions<T>['codeGeneration'];
    /**
     * Allows to extend the VMContext. Note that it must return a contextified
     * object so ideally it should return the same reference it receives.
     */
    extend?: (context: ExtendedDictionary<Primitives>) => ExtendedDictionary<T>;
    /**
     * Provides an initial map to the require cache.
     * If none is given, it will be initialized to an empty map.
     */
    requireCache?: VMOptions<T>['requireCache'];
}
/**
 * An implementation of a VM that pre-loads on its context Edge Primitives.
 * The context can be extended from its constructor.
 */
export declare class EdgeVM<T extends Primitives> extends VM<T> {
    constructor(options?: EdgeVMOptions<T>);
}
