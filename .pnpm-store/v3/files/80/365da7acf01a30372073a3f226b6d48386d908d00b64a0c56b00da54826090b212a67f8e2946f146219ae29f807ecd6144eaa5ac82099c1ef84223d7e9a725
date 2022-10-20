export interface ReturnValue {
    /** Current elapsed time in seconds */
    elapsedTime: number;
    /** Reset method to reset the elapsed time and start over. startAt value can be changed by passing newStartAt */
    reset: (newStartAt?: number) => void;
}
export interface OnComplete {
    /** Indicates if the loop should start over. Default: false */
    shouldRepeat?: boolean;
    /** Delay in seconds before looping again. Default: 0 */
    delay?: number;
    /** Change the startAt value before looping again. Default: startAt value */
    newStartAt?: number;
}
export interface Props {
    /** Indicates if the loop to get the elapsed time is running or it is paused */
    isPlaying: boolean;
    /** Animation duration in seconds */
    duration?: number;
    /** Start the animation at provided time in seconds. Default: 0 */
    startAt?: number;
    /** Update interval in seconds. Determines how often the elapsed time value will change. When set to 0 the value will update on each key frame. Default: 0 */
    updateInterval?: number;
    /** On animation complete event handler. It can be used to restart/repeat the animation by returning an object */
    onComplete?: (totalElapsedTime: number) => OnComplete | void;
    /** On time update event handler. It receives the current elapsedTime time in seconds */
    onUpdate?: (elapsedTime: number) => void;
}
export declare const useElapsedTime: ({ isPlaying, duration, startAt, updateInterval, onComplete, onUpdate, }: Props) => ReturnValue;
