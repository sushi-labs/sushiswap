'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_utils_base64Encode = require('../../internal/utils/base64Encode.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @memberOf Actions.CustomFunction
 * @see Visit {@link Actions.CustomFunction|Custom functions} for an example
 */
var CustomFunctionAction = /** @class */ (function (_super) {
    tslib_es6.__extends(CustomFunctionAction, _super);
    /**
     *
     * @param {string} fn The custom function to use, can be a URL or a publicID
     */
    function CustomFunctionAction(fn) {
        var _this = _super.call(this) || this;
        _this.fn = fn;
        return _this;
    }
    CustomFunctionAction.prototype.encodeCustomFunctionString = function (fn) {
        var encodedSource = internal_utils_base64Encode.base64Encode(fn);
        return encodedSource;
    };
    /**
     * Use a WASM as a custom function,
     * Used with the builders of `remote` and `wasm` from {@link Actions.CustomFunction|Custom functions}
     */
    CustomFunctionAction.prototype.asWasm = function () {
        this.mode = 'wasm';
        return this;
    };
    /**
     * Use a remote URL as a custom function
     * Used with the builders of `remote` and `wasm` from {@link Actions.CustomFunction|Custom functions}
     */
    CustomFunctionAction.prototype.asRemote = function () {
        this.mode = 'remote';
        return this;
    };
    CustomFunctionAction.prototype.prepareQualifiers = function () {
        this.encodedFn = this.fn;
        if (this.mode === 'remote') {
            this.encodedFn = this.encodeCustomFunctionString(this.fn);
        }
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('fn', new internal_qualifier_QualifierValue.QualifierValue([this.pre, this.mode, this.encodedFn])));
    };
    CustomFunctionAction.prototype.toString = function () {
        return _super.prototype.toString.call(this)
            .replace(/\//g, ':');
    };
    return CustomFunctionAction;
}(internal_Action.Action));

module.exports = CustomFunctionAction;
