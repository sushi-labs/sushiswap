'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../../tslib.es6-f1398b83.cjs');
var internal_utils_prepareColor = require('../../../../internal/utils/prepareColor.cjs');
var qualifiers_background_shared_base_BackgroundQualifier = require('./BackgroundQualifier.cjs');
require('../../../../internal/qualifier/Qualifier.cjs');
require('../../../../internal/qualifier/QualifierValue.cjs');
require('../../../../internal/models/QualifierModel.cjs');
require('../../../../internal/models/qualifierToJson.cjs');
require('../../../../internal/utils/unsupportedError.cjs');

/**
 * @description Defines the background color to use when resizing with padding.
 * @memberOf Qualifiers.Background
 * @extends {Qualifiers.Background.BackgroundQualifier}
 */
var BaseCommonBackground = /** @class */ (function (_super) {
    tslib_es6.__extends(BaseCommonBackground, _super);
    function BaseCommonBackground() {
        var _this = _super.call(this) || this;
        _this._palette = [];
        return _this;
    }
    /**
     * @description Selects the strongest contrasting color to use for padding.
     * @return {this}
     */
    BaseCommonBackground.prototype.contrast = function () {
        this._contrast = true;
        return this;
    };
    /**
     * @description Defines the custom colors to use when resizing using content-aware padding.
     * @param {...string} colors One or more colors - Example: palette('green', 'red', blue')
     * @return {this}
     */
    BaseCommonBackground.prototype.palette = function () {
        var colors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            colors[_i] = arguments[_i];
        }
        this._palette = colors.map(function (color) {
            return internal_utils_prepareColor.prepareColor(color);
        });
        return this;
    };
    return BaseCommonBackground;
}(qualifiers_background_shared_base_BackgroundQualifier.BackgroundQualifier));

exports.BaseCommonBackground = BaseCommonBackground;
