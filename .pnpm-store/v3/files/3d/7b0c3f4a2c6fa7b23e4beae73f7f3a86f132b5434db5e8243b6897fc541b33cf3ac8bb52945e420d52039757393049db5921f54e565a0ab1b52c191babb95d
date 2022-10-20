import { InterpolatorArgs, InterpolatorFn } from '@react-spring/types';
import { FluidValue } from '@react-spring/shared';
import { FrameValue } from './FrameValue';
/**
 * An `Interpolation` is a memoized value that's computed whenever one of its
 * `FluidValue` dependencies has its value changed.
 *
 * Other `FrameValue` objects can depend on this. For example, passing an
 * `Interpolation` as the `to` prop of a `useSpring` call will trigger an
 * animation toward the memoized value.
 */
export declare class Interpolation<Input = any, Output = any> extends FrameValue<Output> {
    /** The source of input values */
    readonly source: unknown;
    /** Useful for debugging. */
    key?: string;
    /** Equals false when in the frameloop */
    idle: boolean;
    /** The function that maps inputs values to output */
    readonly calc: InterpolatorFn<Input, Output>;
    /** The inputs which are currently animating */
    protected _active: Set<FluidValue<any, any>>;
    constructor(
    /** The source of input values */
    source: unknown, args: InterpolatorArgs<Input, Output>);
    advance(_dt?: number): void;
    protected _get(): Output;
    protected _start(): void;
    protected _attach(): void;
    protected _detach(): void;
    /** @internal */
    eventObserved(event: FrameValue.Event): void;
}
