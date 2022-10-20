'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../../internal/qualifier/Qualifier.cjs');
require('../../../qualifiers/flag/FlagQualifier.cjs');
require('../../../internal/qualifier/QualifierValue.cjs');
require('../../../internal/utils/dataStructureUtils.cjs');
require('../../../internal/models/ActionModel.cjs');
require('../../../internal/models/actionToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');

/**
 * Enhances an image to its best visual quality with the Viesus Automatic Image Enhancement add-on.</br>
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/viesus_automatic_image_enhancement_addon|Viesus Automatic Image Enhancement.}
 * @memberOf Actions.Adjust
 */
var ViesusCorrectAdjustAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ViesusCorrectAdjustAction, _super);
    function ViesusCorrectAdjustAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @description Enhances the image without correcting for red eye.
     */
    ViesusCorrectAdjustAction.prototype.noRedEye = function () {
        this._noRedEye = true;
        return this;
    };
    /**
     * @description Applies saturation to the skin tones in the image.
     * @param level The saturation level. (Range: -100 to 100, Server default: 50).
     */
    ViesusCorrectAdjustAction.prototype.skinSaturation = function (level) {
        this._skinSaturation = true;
        if (level) {
            this._skinSaturationLevel = level;
        }
        return this;
    };
    ViesusCorrectAdjustAction.prototype.prepareQualifiers = function () {
        var value = 'viesus_correct';
        if (this._noRedEye) {
            value += ':no_redeye';
        }
        if (this._skinSaturation) {
            value += ':skin_saturation';
            if (typeof this._skinSaturationLevel !== 'undefined') {
                value += "_" + this._skinSaturationLevel;
            }
        }
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', value));
    };
    return ViesusCorrectAdjustAction;
}(internal_Action.Action));

exports.ViesusCorrectAdjustAction = ViesusCorrectAdjustAction;
