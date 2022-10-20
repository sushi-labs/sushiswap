import { ForwardRefExoticComponent, ReactNode } from 'react';
import { ViewStyle, RecursiveArray } from 'react-native';
import { AssignableKeys, ComponentPropsWithRef, ElementType } from '@react-spring/types';
import { FluidValue } from '@react-spring/shared';
import { primitives } from './primitives';
declare type Primitives = typeof primitives;
declare type AnimatedPrimitives = {
    [P in keyof Primitives]: AnimatedComponent<Primitives[P]>;
};
/** The type of the `animated()` function */
export declare type WithAnimated = {
    <T extends ElementType>(wrappedComponent: T): AnimatedComponent<T>;
} & AnimatedPrimitives;
/** The type of an `animated()` component */
export declare type AnimatedComponent<T extends ElementType> = ForwardRefExoticComponent<AnimatedProps<ComponentPropsWithRef<T>> & {
    children?: ReactNode;
}>;
/** The props of an `animated()` component */
export declare type AnimatedProps<Props extends object> = {
    [P in keyof Props]: P extends 'ref' | 'key' ? Props[P] : AnimatedProp<Props[P]>;
};
declare type AnimatedProp<T> = [T, T] extends [infer T, infer DT] ? [DT] extends [never] ? never : DT extends void ? undefined : DT extends ReadonlyArray<number | string> ? AnimatedArray<DT> | AnimatedLeaf<T> : DT extends ReadonlyArray<any> ? TransformArray extends DT ? AnimatedTransform : AnimatedStyles<DT> : [AssignableKeys<DT, ViewStyle>] extends [never] ? DT | AnimatedLeaf<T> : AnimatedStyle<DT> : never;
declare type AnimatedArray<T extends ReadonlyArray<number | string>> = {
    [P in keyof T]: T[P] | FluidValue<T[P]>;
};
declare type AnimatedStyles<T extends ReadonlyArray<any>> = unknown & T extends RecursiveArray<infer U> ? {
    [P in keyof T]: RecursiveArray<AnimatedProp<U>>;
}[keyof T] : {
    [P in keyof T]: [T[P]] extends [infer DT] ? DT extends ReadonlyArray<any> ? AnimatedStyles<DT> : DT extends object ? [AssignableKeys<DT, ViewStyle>] extends [never] ? AnimatedProp<DT> : {
        [P in keyof DT]: AnimatedProp<DT[P]>;
    } : DT : never;
};
export declare type AnimatedStyle<T> = [T, T] extends [infer T, infer DT] ? DT extends void ? undefined : [DT] extends [never] ? never : DT extends object ? {
    [P in keyof T]: P extends 'transform' ? AnimatedTransform : AnimatedStyle<T[P]>;
} : DT | AnimatedLeaf<T> : never;
declare type TransformArray = Exclude<ViewStyle['transform'], void>;
export declare type AnimatedTransform = Array<TransformArray[number] extends infer T ? {
    [P in keyof T]: T[P] | FluidValue<T[P]>;
} : never>;
declare type AnimatedLeaf<T> = Exclude<T, object | void> | Extract<T, ReadonlyArray<number | string>> extends infer U ? [U] extends [never] ? never : FluidValue<U | Exclude<T, object | void>> : never;
export {};
