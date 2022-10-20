'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../../tslib.es6-f1398b83.cjs');
var qualifiers_background_shared_base_BaseCommonBackground = require('./BaseCommonBackground.cjs');
require('../../../../internal/utils/prepareColor.cjs');
require('./BackgroundQualifier.cjs');
require('../../../../internal/qualifier/Qualifier.cjs');
require('../../../../internal/qualifier/QualifierValue.cjs');
require('../../../../internal/models/QualifierModel.cjs');
require('../../../../internal/models/qualifierToJson.cjs');
require('../../../../internal/utils/unsupportedError.cjs');

/**
 * @description Defines the gradient fade effect to use for the background when resizing with padding.
 * @memberOf Qualifiers.Background
 * @extends {Qualifiers.Background.BaseCommonBackground}
 */
var BaseGradientBackground = /** @class */ (function (_super) {
    tslib_es6.__extends(BaseGradientBackground, _super);
    function BaseGradientBackground() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     *
     * @description Sets the number of predominant colors to use (2 or 4).
     * @param {number} num
     * @return {this}
     */
    BaseGradientBackground.prototype.gradientColors = function (num) {
        this._gradientColors = num;
        return this;
    };
    /**
     * @description Sets the direction for a background gradient fade effect.
     * @param {Qualifiers.GradientDirection | GradientDirectionType | string} direction Use one of these functions
     * provided by {@link Qualifiers.GradientDirection|GradientDirection}
     * @return {this}
     */
    BaseGradientBackground.prototype.gradientDirection = function (direction) {
        this._gradientDirection = direction;
        return this;
    };
    return BaseGradientBackground;
}(qualifiers_background_shared_base_BaseCommonBackground.BaseCommonBackground));

exports.BaseGradientBackground = BaseGradientBackground;
