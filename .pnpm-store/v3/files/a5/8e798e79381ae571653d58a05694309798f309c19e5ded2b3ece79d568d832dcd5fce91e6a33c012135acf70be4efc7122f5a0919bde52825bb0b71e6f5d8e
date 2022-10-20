/// <reference types="react" />
import { Props as ETProps } from 'use-elapsed-time';
export declare type ReturnValue = number | string | React.ReactNode;
export declare type EasingFn = (currentTime: number, startValue: number, changeInValue: number, duration: number) => number;
export declare type Easing = 'easeOutCubic' | 'easeInCubic' | 'linear' | EasingFn;
export interface ReturnProps {
    /** Current value of the count up animation */
    value: ReturnValue;
    /** Method to start over the animation*/
    reset: () => void;
}
export interface Props {
    /** Play and pause counting animation. Default: false */
    isCounting?: boolean;
    /** Initial value. Default: 0 */
    start?: number;
    /** Target value */
    end?: number;
    /** Animation duration in seconds. Default to 2 if end is set*/
    duration?: number;
    /** Number of decimal places after the decimal separator. Default: 0 */
    decimalPlaces?: number;
    /** Decimal separator character. Default: "." */
    decimalSeparator?: string;
    /** Thousands separator character. Default: "" */
    thousandsSeparator?: string;
    /** On animation complete event handler */
    onComplete?: ETProps['onComplete'];
    /**  Easing function to control how the animation is progressing. Default: easeOutExpo */
    easing?: Easing;
    /** Function that formats the output value */
    formatter?: (value: number) => ReturnValue;
    /** Update interval in seconds. Determines how often the animated value will change. When set to 0 the value will update on each key frame. Default: 0 */
    updateInterval?: number;
    /** On value update event handler. It receives the current value */
    onUpdate?: (value: ReturnValue) => void;
}
