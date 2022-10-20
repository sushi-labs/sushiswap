'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var internal_qualifier_Qualifier = require('../../../internal/qualifier/Qualifier.cjs');
var internal_Action = require('../../../internal/Action.cjs');
var qualifiers_region = require('../../../qualifiers/region.cjs');
require('../../../internal/qualifier/QualifierValue.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');
require('../../../qualifiers/flag/FlagQualifier.cjs');
require('../../../internal/utils/dataStructureUtils.cjs');
require('../../../internal/models/ActionModel.cjs');
require('../../../internal/models/actionToJson.cjs');
require('../../../qualifiers/region/CustomRegion.cjs');
require('../../../qualifiers/region/NamedRegion.cjs');

/**
 * @description The Action class of the blur Builder.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var BlurAction = /** @class */ (function (_super) {
    tslib_es6.__extends(BlurAction, _super);
    function BlurAction(strength) {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        _this._strength = strength;
        _this._actionModel.actionType = 'blur';
        _this._actionModel.strength = strength;
        return _this;
    }
    /**
     * @description Specifies the region to blur.
     * @param {NamedRegion} blurRegion
     */
    BlurAction.prototype.region = function (blurRegion) {
        this._actionModel.region = { RegionType: blurRegion.regionType };
        this._region = blurRegion;
        return this;
    };
    /**
     * @description Sets the strength of the blur effect.
     * @param {number | string} strength
     */
    BlurAction.prototype.strength = function (strength) {
        this._strength = strength;
        this._actionModel.strength = strength;
        return this;
    };
    BlurAction.prototype.prepareQualifiers = function () {
        /*
         * Blur with region is a unique object in this codebase.
         * On top of Blur being an Action with Qualifiers,
         * it also accepts a Qualifier called Region.
         *
         * This Qualifier is in itself composite of qualifiers (such as height, or width).
         * The existence of Region changes the output of Blur in non traditional ways
         * which forced this relatively ad-hoc implementation.
         *
         * Aside from all of that, all of the Qualifiers in the component should be alphabetized
         * This happens naturally in the Action class,
         * however since we're dealing with two levels of qualifiers (Blur and Region),
         * these need to be merged.
         *
         * This function will merge the Region qualifiers with Blur
         * and add all needed implicit qualifiers (like g_ocr_text).
         * We're not using the full Gravity Qualifier here to prevent the code import for such a simplistic case
         */
        var _this = this;
        var str = this._strength ? ":" + this._strength : '';
        if ('_region' in this) {
            var qualifiers = this._region.qualifiers;
            // Copy qualifiers from the region "action" to the blur action
            qualifiers.forEach(function (q) { return _this.addQualifier(q); });
            if (this._region.regionType === 'named') {
                this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', "blur_region" + str));
            }
            if (this._region.regionType === 'ocr_text') {
                this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', "blur_region" + str));
                this.addQualifier(new internal_qualifier_Qualifier.Qualifier('g', "ocr_text"));
            }
            if (this._region.regionType === 'faces') {
                this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', "blur_faces" + str));
            }
        }
        else {
            this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', "blur" + str));
        }
    };
    BlurAction.fromJson = function (actionModel) {
        var _a = actionModel; _a.actionType; var strength = _a.strength, region = _a.region;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(strength);
        strength && result.strength(strength);
        if (region && region.RegionType === 'faces') {
            result.region(qualifiers_region.faces());
        }
        if (region && region.RegionType === 'custom') {
            result.region(qualifiers_region.custom());
        }
        return result;
    };
    return BlurAction;
}(internal_Action.Action));

exports.BlurAction = BlurAction;
