'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../../tslib.es6-f1398b83.cjs');
var qualifiers_background_shared_base_BaseGradientBackground = require('../base/BaseGradientBackground.cjs');
require('../base/BaseCommonBackground.cjs');
require('../../../../internal/utils/prepareColor.cjs');
require('../base/BackgroundQualifier.cjs');
require('../../../../internal/qualifier/Qualifier.cjs');
require('../../../../internal/qualifier/QualifierValue.cjs');
require('../../../../internal/models/QualifierModel.cjs');
require('../../../../internal/models/qualifierToJson.cjs');
require('../../../../internal/utils/unsupportedError.cjs');

/**
 * @description Specifies that the gradient fade effect, used for the background when resizing with padding, uses the
 * predominant colors in the border pixels of the image.
 * @memberOf Qualifiers.Background
 * @extends {Qualifiers.Background.BaseGradientBackground}
 */
var BackgroundBorderGradientQualifier = /** @class */ (function (_super) {
    tslib_es6.__extends(BackgroundBorderGradientQualifier, _super);
    function BackgroundBorderGradientQualifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @description
     * Stringify the qualifier
     * BackgroundQualifiers don't have a value, but instead override the toString() function.
     */
    BackgroundBorderGradientQualifier.prototype.toString = function () {
        return ("\n    b_auto:border_gradient\n    " + (this._contrast ? '_contrast' : '') + "\n    " + (this._gradientColors ? ":" + this._gradientColors : '') + "\n    " + (this._gradientDirection ? ":" + this._gradientDirection : '') + "\n    " + (this._palette.length ? ":palette_" + this._palette.join('_') : '') + "\n    ").replace(/\s+/g, '');
    };
    return BackgroundBorderGradientQualifier;
}(qualifiers_background_shared_base_BaseGradientBackground.BaseGradientBackground));

exports.BackgroundBorderGradientQualifier = BackgroundBorderGradientQualifier;
