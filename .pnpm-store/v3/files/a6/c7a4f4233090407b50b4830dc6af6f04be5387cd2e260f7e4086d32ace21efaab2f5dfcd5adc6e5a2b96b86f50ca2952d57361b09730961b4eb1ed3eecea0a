'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_utils_prepareColor = require('../../internal/utils/prepareColor.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @description Applies a shadow filter to the asset.
 * @memberOf Actions.Effect
 * @extends SDK.Action
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var ShadowEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ShadowEffectAction, _super);
    function ShadowEffectAction(effectType, strength) {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        _this._actionModel.actionType = effectType;
        _this.effectType = effectType;
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', new internal_qualifier_QualifierValue.QualifierValue(['shadow', strength])));
        return _this;
    }
    /**
     * @description The strength of the shadow. (Range: 0 to 100, Server default: 40)
     * @param {number} strength
     * @return {this}
     */
    ShadowEffectAction.prototype.strength = function (strength) {
        this._actionModel.strength = strength;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', new internal_qualifier_QualifierValue.QualifierValue(['shadow', strength])));
    };
    /**
     * @description The X offset the shadow
     * @param {number | SDK.ExpressionQualifier} x
     * @return {this}
     */
    ShadowEffectAction.prototype.offsetX = function (x) {
        this._actionModel.offsetX = x;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('x', new internal_qualifier_QualifierValue.QualifierValue(x)));
    };
    /**
     * @description The Y offset the shadow
     * @param {number | SDK.ExpressionQualifier} y
     * @return {this}
     */
    ShadowEffectAction.prototype.offsetY = function (y) {
        this._actionModel.offsetY = y;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('y', new internal_qualifier_QualifierValue.QualifierValue(y)));
    };
    /**
     * @description The color of the shadow (Server default: gray)
     * @param color
     * @return {this}
     */
    ShadowEffectAction.prototype.color = function (color) {
        this._actionModel.color = color;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('co', new internal_qualifier_QualifierValue.QualifierValue(internal_utils_prepareColor.prepareColor(color))));
    };
    ShadowEffectAction.fromJson = function (actionModel) {
        var _a = actionModel, actionType = _a.actionType, strength = _a.strength, offsetX = _a.offsetX, offsetY = _a.offsetY, color = _a.color;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(actionType, strength);
        offsetX && result.offsetX(offsetX);
        offsetY && result.offsetY(offsetY);
        color && result.color(color);
        return result;
    };
    return ShadowEffectAction;
}(internal_Action.Action));

exports.ShadowEffectAction = ShadowEffectAction;
