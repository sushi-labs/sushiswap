'use strict';

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var qualifiers_background_shared_base_BackgroundQualifier = require('./base/BackgroundQualifier.cjs');
require('../../../internal/qualifier/Qualifier.cjs');
require('../../../internal/qualifier/QualifierValue.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');

/**
 * @description A class for blurred background transformations.
 * @memberOf Qualifiers.Background
 * @extends {Qualifiers.Background.BackgroundQualifier}
 */
var BlurredBackgroundAction = /** @class */ (function (_super) {
    tslib_es6.__extends(BlurredBackgroundAction, _super);
    function BlurredBackgroundAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @description Sets the intensity of the blur.
     * @param {number} value - The intensity of the blur.
     */
    BlurredBackgroundAction.prototype.intensity = function (value) {
        this.intensityLevel = value;
        return this;
    };
    /**
     * @description Sets the brightness of the background.
     * @param {number} value - The brightness of the background.
     */
    BlurredBackgroundAction.prototype.brightness = function (value) {
        this.brightnessLevel = value;
        return this;
    };
    /**
     * @description
     * Stringify the qualifier
     * BackgroundQualifiers don't have a value, but instead override the toString() function
     */
    BlurredBackgroundAction.prototype.toString = function () {
        // b_blurred:{intensity}:{brightness}
        return ("\n    b_blurred\n    " + (this.intensityLevel ? ":" + this.intensityLevel : '') + "\n    " + (this.brightnessLevel ? ":" + this.brightnessLevel : '') + "\n    ").replace(/\s+/g, '');
    };
    return BlurredBackgroundAction;
}(qualifiers_background_shared_base_BackgroundQualifier.BackgroundQualifier));

module.exports = BlurredBackgroundAction;
