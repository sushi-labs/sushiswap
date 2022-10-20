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
exports.getMergeFn = exports.combineMerge = exports.overwriteMerge = exports.isObject = void 0;
var isObject = function (obj) {
    if (typeof obj === 'object' && obj !== null) {
        if (typeof Object.getPrototypeOf === 'function') {
            var prototype = Object.getPrototypeOf(obj);
            return prototype === Object.prototype || prototype === null;
        }
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    return false;
};
exports.isObject = isObject;
var overwriteMerge = function (_, currArr) { return currArr; };
exports.overwriteMerge = overwriteMerge;
var combineMerge = function (prevArr, currArr) {
    return __spreadArray([], __read(new Set(__spreadArray(__spreadArray([], __read(prevArr), false), __read(currArr), false))), false);
};
exports.combineMerge = combineMerge;
var getMergeFn = function (type) {
    switch (type) {
        case 'overwrite':
            return exports.overwriteMerge;
        case 'combine':
        default:
            return exports.combineMerge;
    }
};
exports.getMergeFn = getMergeFn;
