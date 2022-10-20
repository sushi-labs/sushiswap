/**
 * Create a copy of the source object with all keys in camelCase
 * @function Util.withCamelCaseKeys
 * @return {Object} a new object
 * @param source
 */
import { isEmpty } from "./isEmpty.js";
export const withCamelCaseKeys = function (source) {
    return convertKeys(source, camelCase);
};
/**
 * Convert string to camelCase
 * @function Util.camelCase
 * @param {string} source - the string to convert
 * @return {string} in camelCase format
 */
export const camelCase = function (source) {
    var words = source.match(reWords);
    words = words.map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase());
    words[0] = words[0].toLocaleLowerCase();
    return words.join('');
};
/**
 * Creates a new object from source, with the keys transformed using the converter.
 * @param {object} source
 * @param {function|null} converter
 * @returns {object}
 */
export var convertKeys = function (source, converter) {
    var result, value;
    result = {};
    for (let key in source) {
        value = source[key];
        if (converter) {
            key = converter(key);
        }
        if (!isEmpty(key)) {
            // @ts-ignore
            result[key] = value;
        }
    }
    return result;
};
export var reWords = (function () {
    var lower, upper;
    upper = '[A-Z]';
    lower = '[a-z]+';
    return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
})();
export function identity(x) {
    return x;
}
export function contains(a, obj) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
export function difference(arr1, arr2) {
    return arr1.filter(x => !arr2.includes(x));
}
