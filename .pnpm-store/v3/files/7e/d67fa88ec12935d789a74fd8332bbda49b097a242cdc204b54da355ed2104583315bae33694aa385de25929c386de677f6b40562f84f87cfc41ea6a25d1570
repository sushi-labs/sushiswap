import { FluidValue } from '@react-spring/shared';
import { Constrain, OneOrMore, Animatable, ExtrapolateType, InterpolatorConfig, InterpolatorFn } from '@react-spring/types';
import { Interpolation } from './Interpolation';
/** Map the value of one or more dependencies */
export declare const to: Interpolator;
/** @deprecated Use the `to` export instead */
export declare const interpolate: Interpolator;
/** Extract the raw value types that are being interpolated */
export declare type Interpolated<T extends ReadonlyArray<any>> = {
    [P in keyof T]: T[P] extends infer Element ? Element extends FluidValue<infer U> ? U : Element : never;
};
/**
 * This interpolates one or more `FluidValue` objects.
 * The exported `interpolate` function uses this type.
 */
export interface Interpolator {
    <Input extends ReadonlyArray<any>, Output>(parents: Input, interpolator: (...args: Interpolated<Input>) => Output): Interpolation<Output>;
    <Input, Output>(parent: FluidValue<Input> | Input, interpolator: InterpolatorFn<Input, Output>): Interpolation<Output>;
    <Out>(parents: OneOrMore<FluidValue>, config: InterpolatorConfig<Out>): Interpolation<Animatable<Out>>;
    <Out>(parents: OneOrMore<FluidValue<number>> | FluidValue<number[]>, range: readonly number[], output: readonly Constrain<Out, Animatable>[], extrapolate?: ExtrapolateType): Interpolation<Animatable<Out>>;
}
