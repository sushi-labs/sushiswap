'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var internal_utils_unsupportedError = require('./utils/unsupportedError.cjs');
require('../tslib.es6-f1398b83.cjs');

/**
 * @summary SDK
 * @memberOf SDK
 * @description Defines an action that's a string literal, no validations or manipulations are performed
 */
var RawAction = /** @class */ (function () {
    function RawAction(raw) {
        this.raw = raw;
    }
    RawAction.prototype.toString = function () {
        return this.raw;
    };
    RawAction.prototype.toJson = function () {
        return { error: internal_utils_unsupportedError.createUnsupportedError("unsupported action " + this.constructor.name) };
    };
    return RawAction;
}());

exports.RawAction = RawAction;
