/**
 * Just any type of object indexed by string or numbers where the value can
 * be anything or the provided generic.
 */
export interface Dictionary<T = any> {
    [key: string | number]: T;
}
/**
 * Extends the Dictionary type to allow having arbitrary keys that can hold
 * any type of data. This would represent an object where we can add extra
 * properties what would not be typed.
 */
export declare type ExtendedDictionary<T extends Dictionary> = T & {
    [key: string | number]: any;
};
