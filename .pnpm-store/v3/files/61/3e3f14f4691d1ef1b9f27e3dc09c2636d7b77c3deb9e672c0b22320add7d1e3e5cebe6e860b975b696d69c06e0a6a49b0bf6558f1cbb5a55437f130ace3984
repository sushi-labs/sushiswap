'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backwards_utils_isEmpty = require('./isEmpty.cjs');

/**
 * Create a copy of the source object with all keys in camelCase
 * @function Util.withCamelCaseKeys
 * @return {Object} a new object
 * @param source
 */
var withCamelCaseKeys = function (source) {
    return convertKeys(source, camelCase);
};
/**
 * Convert string to camelCase
 * @function Util.camelCase
 * @param {string} source - the string to convert
 * @return {string} in camelCase format
 */
var camelCase = function (source) {
    var words = source.match(reWords);
    words = words.map(function (word) { return word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase(); });
    words[0] = words[0].toLocaleLowerCase();
    return words.join('');
};
/**
 * Creates a new object from source, with the keys transformed using the converter.
 * @param {object} source
 * @param {function|null} converter
 * @returns {object}
 */
var convertKeys = function (source, converter) {
    var result, value;
    result = {};
    for (var key in source) {
        value = source[key];
        if (converter) {
            key = converter(key);
        }
        if (!backwards_utils_isEmpty.isEmpty(key)) {
            // @ts-ignore
            result[key] = value;
        }
    }
    return result;
};
var reWords = (function () {
    var lower, upper;
    upper = '[A-Z]';
    lower = '[a-z]+';
    return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
})();
function identity(x) {
    return x;
}
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
function difference(arr1, arr2) {
    return arr1.filter(function (x) { return !arr2.includes(x); });
}

exports.camelCase = camelCase;
exports.contains = contains;
exports.convertKeys = convertKeys;
exports.difference = difference;
exports.identity = identity;
exports.reWords = reWords;
exports.withCamelCaseKeys = withCamelCaseKeys;
