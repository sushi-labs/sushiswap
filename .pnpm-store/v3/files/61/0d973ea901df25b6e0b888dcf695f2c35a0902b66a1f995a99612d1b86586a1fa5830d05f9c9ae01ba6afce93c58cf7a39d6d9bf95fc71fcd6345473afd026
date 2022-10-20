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
 * @description The Action class of the pixelate Builder
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var Pixelate = /** @class */ (function (_super) {
    tslib_es6.__extends(Pixelate, _super);
    function Pixelate(squareSize) {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        _this._squareSize = squareSize;
        _this._actionModel.actionType = 'pixelate';
        _this._actionModel.squareSize = squareSize;
        return _this;
    }
    /**
     * @description Specifies the region to piexlate.
     * @param {NamedRegion} pixelateRegion
     */
    Pixelate.prototype.region = function (pixelateRegion) {
        this._region = pixelateRegion;
        this._actionModel.region = { RegionType: this._region.regionType };
        return this;
    };
    /**
     * @description Sets the squareSize of the pixelate effect.
     * @param {number | string} squareSize
     */
    Pixelate.prototype.squareSize = function (squareSize) {
        this._squareSize = squareSize;
        this._actionModel.squareSize = squareSize;
        return this;
    };
    Pixelate.prototype.prepareQualifiers = function () {
        /*
         * pixelate with region is a unique object in this codebase.
         * On top of pixelate being an Action with Qualifiers,
         * it also accepts a Qualifier called Region.
         *
         * This Qualifier is in itself composite of qualifiers (such as height, or width).
         * The existence of Region changes the output of pixelate in non traditional ways
         * which forced this relatively ad-hoc implementation.
         *
         * Aside from all of that, all of the Qualifiers in the component should be alphabetized
         * This happens naturally in the Action class,
         * however since we're dealing with two levels of qualifiers (pixelate and Region),
         * these need to be merged.
         *
         * This function will merge the Region qualifiers with pixelate
         * and add all needed implicit qualifiers (like g_ocr_text).
         * We're not using the full Gravity Qualifier here to prevent the code import for such a simplistic case
         */
        var _this = this;
        var str = this._squareSize ? ":" + this._squareSize : '';
        if ('_region' in this) {
            var qualifiers = this._region.qualifiers;
            // Copy qualifiers from the region "action" to the pixelate action
            qualifiers.forEach(function (q) { return _this.addQualifier(q); });
            if (this._region.regionType === 'named') {
                this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', "pixelate_region" + str));
            }
            if (this._region.regionType === 'ocr_text') {
                this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', "pixelate_region" + str));
                this.addQualifier(new internal_qualifier_Qualifier.Qualifier('g', "ocr_text"));
            }
            if (this._region.regionType === 'faces') {
                this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', "pixelate_faces" + str));
            }
        }
        else {
            this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', "pixelate" + str));
        }
    };
    Pixelate.fromJson = function (actionModel) {
        var _a = actionModel; _a.actionType; var region = _a.region, squareSize = _a.squareSize;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(squareSize);
        squareSize && result.squareSize(squareSize);
        if (region && region.RegionType === 'faces') {
            result.region(qualifiers_region.faces());
        }
        if (region && region.RegionType === 'custom') {
            result.region(qualifiers_region.custom());
        }
        return result;
    };
    return Pixelate;
}(internal_Action.Action));

exports.Pixelate = Pixelate;
