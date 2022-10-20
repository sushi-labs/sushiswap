'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var internal_utils_unsupportedError = require('../utils/unsupportedError.cjs');
require('../../tslib.es6-f1398b83.cjs');

/**
 * Returns the action's model
 */
function actionToJson() {
    var actionModelIsNotEmpty = this._actionModel && Object.keys(this._actionModel).length;
    if (actionModelIsNotEmpty) {
        return this._actionModel;
    }
    return { error: internal_utils_unsupportedError.createUnsupportedError("unsupported action " + this.constructor.name) };
}

exports.actionToJson = actionToJson;
