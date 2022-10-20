'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @description Applies a gradient fade effect from one edge of the image.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var GradientFadeEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(GradientFadeEffectAction, _super);
    function GradientFadeEffectAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._actionModel = { actionType: 'gradientFade' };
        return _this;
    }
    /**
     * @description Sets the strength of the fade effect.
     * @param {number} strength The strength of the fade effect. (Range: 0 to 100, Server default: 20)
     */
    GradientFadeEffectAction.prototype.strength = function (strength) {
        this._actionModel.strength = strength;
        this._strength = strength;
        return this;
    };
    /**
     * @description Sets the mode of gradient fade.
     * @param {string | Qualifiers.GradientFade} type The mode of gradient fade.
     */
    GradientFadeEffectAction.prototype.type = function (type) {
        this._actionModel.type = type;
        this._type = type;
        return this;
    };
    /**
     * @description Sets the x dimension of the start point.
     * @param {number | string} x The x dimension of the start point.
     */
    GradientFadeEffectAction.prototype.horizontalStartPoint = function (x) {
        this._actionModel.horizontalStartPoint = x;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('x', x));
    };
    /**
     * @description Sets the y dimension of the start point.
     * @param {number | string} y The y dimension of the start point.
     */
    GradientFadeEffectAction.prototype.verticalStartPoint = function (y) {
        this._actionModel.verticalStartPoint = y;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('y', y));
    };
    GradientFadeEffectAction.prototype.prepareQualifiers = function () {
        var str = 'gradient_fade';
        if (this._type) {
            str += ":" + this._type;
        }
        if (this._strength) {
            str += ":" + this._strength;
        }
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', str));
    };
    GradientFadeEffectAction.fromJson = function (actionModel) {
        var _a = actionModel; _a.actionType; var verticalStartPoint = _a.verticalStartPoint, horizontalStartPoint = _a.horizontalStartPoint, type = _a.type, strength = _a.strength;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this();
        verticalStartPoint && result.verticalStartPoint(verticalStartPoint);
        horizontalStartPoint && result.horizontalStartPoint(horizontalStartPoint);
        type && result.type(type);
        strength && result.strength(strength);
        return result;
    };
    return GradientFadeEffectAction;
}(internal_Action.Action));

exports.GradientFadeEffectAction = GradientFadeEffectAction;
