'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
var internal_Action = require('../../internal/Action.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');

/**
 * @description Applies a cartoon effect to an image.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var CartoonifyEffect = /** @class */ (function (_super) {
    tslib_es6.__extends(CartoonifyEffect, _super);
    function CartoonifyEffect(effectName, strength) {
        var _this = 
        // We don't pass level in the constructor, we'll build it in the prepareParam
        _super.call(this) || this;
        _this._actionModel = {};
        _this.cartoonifyStrength = strength;
        _this.effectName = effectName;
        _this._actionModel.actionType = effectName;
        return _this;
    }
    /**
     * @description Sets the thickness of the lines.
     * @param {number} lineStrength The thickness of the lines. (Range: 0 to 100, Server default: 50)
     * @return {this}
     */
    CartoonifyEffect.prototype.lineStrength = function (lineStrength) {
        this.cartoonifyStrength = lineStrength;
        this._actionModel.lineStrength = lineStrength;
        return this;
    };
    /**
     * @description Achieves a black and white cartoon effect.
     * @return {this}
     */
    CartoonifyEffect.prototype.blackwhite = function () {
        this._actionModel.blackAndWhite = true;
        this.colorReduction = 'bw';
        return this;
    };
    /**
     * @description
     * Sets the decrease in the number of colors and corresponding saturation boost of the remaining colors. <br/>
     * Higher reduction values result in a less realistic look.
     * @param {number } level The decrease in the number of colors and corresponding saturation boost of the remaining colors. (Range: 0 to 100, Server default: automatically adjusts according to the line_strength value). Set to 'bw' for a black and white cartoon effect.
     * @return {this}
     */
    CartoonifyEffect.prototype.colorReductionLevel = function (level) {
        this._actionModel.colorReductionLevel = level;
        this.colorReduction = level;
        return this;
    };
    CartoonifyEffect.prototype.prepareQualifiers = function () {
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', new internal_qualifier_QualifierValue.QualifierValue([this.effectName, this.cartoonifyStrength, this.colorReduction])));
        return;
    };
    CartoonifyEffect.fromJson = function (actionModel) {
        var _a = actionModel, actionType = _a.actionType, lineStrength = _a.lineStrength, blackAndWhite = _a.blackAndWhite, colorReductionLevel = _a.colorReductionLevel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(actionType, lineStrength);
        blackAndWhite && result.blackwhite();
        colorReductionLevel && result.colorReductionLevel(colorReductionLevel);
        lineStrength && result.lineStrength(lineStrength);
        return result;
    };
    return CartoonifyEffect;
}(internal_Action.Action));

exports.CartoonifyEffect = CartoonifyEffect;
