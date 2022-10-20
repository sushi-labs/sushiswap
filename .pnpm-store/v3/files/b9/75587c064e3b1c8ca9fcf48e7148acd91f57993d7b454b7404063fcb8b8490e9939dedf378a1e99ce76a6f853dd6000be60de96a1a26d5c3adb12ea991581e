'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var internal_utils_base64Encode = require('../../internal/utils/base64Encode.cjs');
var backwards_utils_isObject = require('../utils/isObject.cjs');

/**
 * Parse custom_function options
 * @private
 * @param {object|*} customFunction a custom function object containing function_type and source values
 * @return {string|*} custom_function transformation string
 */
function processCustomFunction(customFunction) {
    if (!backwards_utils_isObject.isObject(customFunction)) {
        return customFunction;
    }
    if (customFunction.function_type === "remote") {
        var encodedSource = internal_utils_base64Encode.base64Encode(customFunction.source)
            .replace(/\+/g, '-') // Convert '+' to '-'
            .replace(/\//g, '_') // Convert '/' to '_'
            .replace(/=+$/, ''); // Remove ending '='
        return [customFunction.function_type, encodedSource].join(":");
    }
    return [customFunction.function_type, customFunction.source].join(":");
}

exports.processCustomFunction = processCustomFunction;
