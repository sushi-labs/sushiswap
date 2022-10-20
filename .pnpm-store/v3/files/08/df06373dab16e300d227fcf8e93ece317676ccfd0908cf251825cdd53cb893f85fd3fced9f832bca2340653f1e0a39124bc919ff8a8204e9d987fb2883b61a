export interface ReturnValue {
    /** Current elapsed time in seconds */
    elapsedTime: number;
    /** Reset method to reset the elapsed time and start over from the "startAt" value */
    reset: (newStartAt: number) => void;
}
export interface OnComplete {
    /** Indicates if the loop should start over. Default: false */
    shouldRepeat?: boolean;
    /** Delay in seconds before looping again. Default: 0 */
    delay?: number;
    /** New value in seconds to start at when repeating the animation. Default: startAt */
    newStartAt?: number;
}
export interface Props {
    /** Animation duration in seconds */
    isPlaying: boolean;
    /** Animation duration in seconds */
    duration?: number;
    /** Start the animation at provided time in seconds. Default: 0 */
    startAt?: number;
    /** Auto reset animation when the key changes. It works similar to React's key prop */
    autoResetKey?: string | number;
    /** On animation complete event handler. It can be used to restart/repeat the animation by returning an object */
    onComplete?: (totalElapsedTime: number) => OnComplete | void;
}
