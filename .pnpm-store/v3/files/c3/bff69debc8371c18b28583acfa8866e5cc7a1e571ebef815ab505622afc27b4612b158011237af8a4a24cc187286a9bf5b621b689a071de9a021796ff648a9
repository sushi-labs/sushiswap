'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
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
 * @description
 * Maps an input color and those similar to the input color to corresponding shades of a specified output color, taking luminosity and chroma into account, in order to recolor objects in your image in a natural way.</br>
 * More highly saturated input colors usually give the best results. It is recommended to avoid input colors approaching white, black, or gray.</br>
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#replace_color_effect|Replace colors example}
 * @memberOf Actions.Adjust
 */
var ReplaceColorAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ReplaceColorAction, _super);
    /**
     * @description Sets the target output color.
     * @param {string} toColor - The HTML name or RGB/A hex code of the target output color.
     */
    function ReplaceColorAction(toColor) {
        var _this = _super.call(this) || this;
        _this.targetColor = toColor;
        return _this;
    }
    /**
     * @description Sets the tolerance threshold.
     * @param {number} toleranceLevel - The tolerance threshold (a radius in the LAB color space) from the input color, </br>
     *                                  representing the span of colors that should be replaced with a correspondingly adjusted version of the target output color. </br>
     *                                  Larger values result in replacing more colors within the image. </br>
     *                                  The more saturated the original input color, the more a change in value will impact the result (Server default: 50).
     * @return {this}
     */
    ReplaceColorAction.prototype.tolerance = function (toleranceLevel) {
        this.toleranceLevel = toleranceLevel;
        return this;
    };
    /**
     * @description Sets the base input color to map.
     * @param {string} baseColor - The HTML name or RGB/A hex code of the base input color to map (Server default: the most prominent high-saturation color in the image).
     * @return {this}
     */
    ReplaceColorAction.prototype.fromColor = function (baseColor) {
        this.baseColor = baseColor;
        return this;
    };
    ReplaceColorAction.prototype.prepareQualifiers = function () {
        // Target color and base color might not exist at this point (optional qualifiers)
        // If they exist, ensure that any # for RGB are removed from the resulting string
        var targetColor = this.targetColor && this.targetColor.toString().replace('#', '');
        var baseColor = this.baseColor && this.baseColor.toString().replace('#', '');
        var qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(['replace_color', targetColor, this.toleranceLevel, baseColor]);
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', qualifierValue));
        return this;
    };
    return ReplaceColorAction;
}(internal_Action.Action));

exports.ReplaceColorAction = ReplaceColorAction;
