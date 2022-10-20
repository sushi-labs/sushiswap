import { Repeater } from '@repeaterjs/repeater';
/**
 * Utility for filtering an event stream.
 */
export declare function filter<T, U extends T>(filter: (input: T) => input is U): (source: AsyncIterable<T>) => Repeater<U, void, unknown>;
export declare function filter<T>(filter: (input: T) => boolean): (source: AsyncIterable<T>) => Repeater<T, void, unknown>;
