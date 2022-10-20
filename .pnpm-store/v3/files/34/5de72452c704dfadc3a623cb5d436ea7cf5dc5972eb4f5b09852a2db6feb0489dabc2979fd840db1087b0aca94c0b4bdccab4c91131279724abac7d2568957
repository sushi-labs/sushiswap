"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.removeIfMatchPattern = exports.removeFromArray = exports.toArray = exports.toChunks = void 0;
var matcher_js_1 = require("./matcher.js");
/**
 * Split an array based on size
 * @param arr
 * @param chunkSize
 * @returns
 */
var toChunks = function (arr, chunkSize) {
    return arr.reduce(function (prev, _, i) {
        return i % chunkSize ? prev : __spreadArray(__spreadArray([], __read(prev), false), [arr.slice(i, i + chunkSize)], false);
    }, []);
};
exports.toChunks = toChunks;
/**
 * simple method to normalize any string to array
 * @param inp
 */
var toArray = function (inp) {
    return typeof inp === 'string' ? [inp] : inp;
};
exports.toArray = toArray;
/**
 * Returns the difference between two arrays
 * @param inputArr input array
 * @param toRemoveArr array of elements to be removed
 */
var removeFromArray = function (inputArr, toRemoveArr) {
    return inputArr.filter(function (x) { return !toRemoveArr.includes(x); });
};
exports.removeFromArray = removeFromArray;
/**
 * Returns the difference between two arrays, which match input array pattern
 * @param inputArr input array
 * @param toRemoveArr array of elements to be removed
 */
var removeIfMatchPattern = function (inputArr, toRemoveArr) {
    var matchedArr = (0, matcher_js_1.matcher)(inputArr, toRemoveArr);
    return (0, exports.removeFromArray)(inputArr, matchedArr);
};
exports.removeIfMatchPattern = removeIfMatchPattern;
