import { matcher } from './matcher.js';
/**
 * Split an array based on size
 * @param arr
 * @param chunkSize
 * @returns
 */
export const toChunks = (arr, chunkSize) => {
    return arr.reduce((prev, _, i) => i % chunkSize ? prev : [...prev, arr.slice(i, i + chunkSize)], []);
};
/**
 * simple method to normalize any string to array
 * @param inp
 */
export const toArray = (inp) => {
    return typeof inp === 'string' ? [inp] : inp;
};
/**
 * Returns the difference between two arrays
 * @param inputArr input array
 * @param toRemoveArr array of elements to be removed
 */
export const removeFromArray = (inputArr, toRemoveArr) => {
    return inputArr.filter((x) => !toRemoveArr.includes(x));
};
/**
 * Returns the difference between two arrays, which match input array pattern
 * @param inputArr input array
 * @param toRemoveArr array of elements to be removed
 */
export const removeIfMatchPattern = (inputArr, toRemoveArr) => {
    const matchedArr = matcher(inputArr, toRemoveArr);
    return removeFromArray(inputArr, matchedArr);
};
