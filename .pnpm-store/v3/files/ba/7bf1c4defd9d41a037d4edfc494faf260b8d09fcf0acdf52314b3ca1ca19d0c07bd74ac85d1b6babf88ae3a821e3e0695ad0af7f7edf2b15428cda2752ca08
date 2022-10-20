import { Animated, AnimatedValue, AnimatedObject } from '@react-spring/animated';
declare type Transform = {
    [key: string]: string | number | Animated;
};
declare type Source = Transform[];
export declare class AnimatedTransform extends AnimatedObject {
    protected source: Source;
    constructor(source: Source);
    getValue(): any[];
    setValue(source: Source): void;
    protected _makePayload(source: Source): AnimatedValue<any>[];
}
export {};
