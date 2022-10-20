'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backwards_transformationProcessing_processCustomFunction = require('./processCustomFunction.cjs');
require('../../internal/utils/base64Encode.cjs');
require('../utils/isObject.cjs');

/**
 * Parse custom_pre_function options
 * @private
 * @param {object|*} customPreFunction a custom function object containing function_type and source values
 * @return {string|*} custom_pre_function transformation string
 */
function processCustomPreFunction(customPreFunction) {
    var result = backwards_transformationProcessing_processCustomFunction.processCustomFunction(customPreFunction);
    return typeof result === 'string' ? "pre:" + result : null;
}

exports.processCustomPreFunction = processCustomPreFunction;
