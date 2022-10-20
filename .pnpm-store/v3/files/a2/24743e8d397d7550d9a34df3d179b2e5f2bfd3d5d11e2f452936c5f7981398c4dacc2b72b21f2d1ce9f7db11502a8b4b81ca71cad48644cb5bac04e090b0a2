import type { AbortSignalWithReason, TaskResult } from './types';
/**
 * Synchronously raises {@link TaskAbortError} if the task tied to the input `signal` has been cancelled.
 * @param signal
 * @param reason
 * @see {TaskAbortError}
 */
export declare const validateActive: (signal: AbortSignal) => void;
/**
 * Returns a promise that will reject {@link TaskAbortError} if the task is cancelled.
 * @param signal
 * @returns
 */
export declare const promisifyAbortSignal: (signal: AbortSignalWithReason<string>) => Promise<never>;
/**
 * Runs a task and returns promise that resolves to {@link TaskResult}.
 * Second argument is an optional `cleanUp` function that always runs after task.
 *
 * **Note:** `runTask` runs the executor in the next microtask.
 * @returns
 */
export declare const runTask: <T>(task: () => Promise<T>, cleanUp?: (() => void) | undefined) => Promise<TaskResult<T>>;
/**
 * Given an input `AbortSignal` and a promise returns another promise that resolves
 * as soon the input promise is provided or rejects as soon as
 * `AbortSignal.abort` is `true`.
 * @param signal
 * @returns
 */
export declare const createPause: <T>(signal: AbortSignal) => (promise: Promise<T>) => Promise<T>;
/**
 * Given an input `AbortSignal` and `timeoutMs` returns a promise that resolves
 * after `timeoutMs` or rejects as soon as `AbortSignal.abort` is `true`.
 * @param signal
 * @returns
 */
export declare const createDelay: (signal: AbortSignal) => (timeoutMs: number) => Promise<void>;
