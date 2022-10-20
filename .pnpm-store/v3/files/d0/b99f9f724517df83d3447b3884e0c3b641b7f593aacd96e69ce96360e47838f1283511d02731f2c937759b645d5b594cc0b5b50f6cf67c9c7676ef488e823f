"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
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
exports.isMatch = exports.matcher = exports.escapeStringRegexp = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var escapeStringRegexp = function (text) {
    if (typeof text !== 'string') {
        throw new TypeError('Expected a string');
    }
    // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
    return text === null || text === void 0 ? void 0 : text.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
};
exports.escapeStringRegexp = escapeStringRegexp;
var regexpCache = new Map();
var sanitizeArray = function (input, inputName) {
    if (!Array.isArray(input)) {
        switch (typeof input) {
            case 'string':
                input = [input];
                break;
            case 'undefined':
                input = [];
                break;
            default:
                throw new TypeError("Expected '".concat(inputName, "' to be a string or an array, but got a type of '").concat(typeof input, "'"));
        }
    }
    return input.filter(function (string) {
        if (typeof string !== 'string') {
            if (typeof string === 'undefined') {
                return false;
            }
            throw new TypeError("Expected '".concat(inputName, "' to be an array of strings, but found a type of '").concat(typeof string, "' in the array"));
        }
        return true;
    });
};
var makeRegexp = function (pattern, options) {
    if (options === void 0) { options = {}; }
    options = __assign({ caseSensitive: false }, options);
    var cacheKey = pattern + JSON.stringify(options);
    if (regexpCache.has(cacheKey)) {
        return regexpCache.get(cacheKey);
    }
    var negated = pattern[0] === '!';
    if (negated) {
        pattern = pattern.slice(1);
    }
    pattern = (0, exports.escapeStringRegexp)(pattern).replace(/\\\*/g, '[\\s\\S]*');
    var regexp = new RegExp("^".concat(pattern, "$"), options.caseSensitive ? '' : 'i');
    regexp.negated = negated;
    regexpCache.set(cacheKey, regexp);
    return regexp;
};
var baseMatcher = function (inputs, patterns, options, firstMatchOnly) {
    var e_1, _a, e_2, _b;
    if (options === void 0) { options = {}; }
    if (firstMatchOnly === void 0) { firstMatchOnly = false; }
    inputs = sanitizeArray(inputs, 'inputs');
    patterns = sanitizeArray(patterns, 'patterns');
    if (patterns.length === 0) {
        return [];
    }
    patterns = patterns.map(function (pattern) { return makeRegexp(pattern, options); });
    var allPatterns = (options || {}).allPatterns;
    var result = [];
    try {
        for (var inputs_1 = __values(inputs), inputs_1_1 = inputs_1.next(); !inputs_1_1.done; inputs_1_1 = inputs_1.next()) {
            var input = inputs_1_1.value;
            // String is included only if it matches at least one non-negated pattern supplied.
            // Note: the `allPatterns` option requires every non-negated pattern to be matched once.
            // Matching a negated pattern excludes the string.
            var matches = void 0;
            var didFit = __spreadArray([], __read(patterns), false).fill(false);
            try {
                for (var _c = (e_2 = void 0, __values(patterns.entries())), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 2), index = _e[0], pattern = _e[1];
                    if (pattern.test(input)) {
                        didFit[index] = true;
                        matches = !pattern.negated;
                        if (!matches) {
                            break;
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c["return"])) _b.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (!(matches === false ||
                (matches === undefined &&
                    patterns.some(function (pattern) { return !pattern.negated; })) ||
                (allPatterns &&
                    didFit.some(function (yes, index) { return !yes && !patterns[index].negated; })))) {
                result.push(input);
                if (firstMatchOnly) {
                    break;
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (inputs_1_1 && !inputs_1_1.done && (_a = inputs_1["return"])) _a.call(inputs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
};
var matcher = function (inputs, patterns, options) {
    if (options === void 0) { options = {}; }
    return baseMatcher(inputs, patterns, options, false);
};
exports.matcher = matcher;
var isMatch = function (inputs, patterns, options) {
    if (options === void 0) { options = {}; }
    return baseMatcher(inputs, patterns, options, true).length > 0;
};
exports.isMatch = isMatch;
