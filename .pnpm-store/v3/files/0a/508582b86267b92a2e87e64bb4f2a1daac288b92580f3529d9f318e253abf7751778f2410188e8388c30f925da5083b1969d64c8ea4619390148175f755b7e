'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_utils_prepareColor = require('../../internal/utils/prepareColor.cjs');
var actions_effect_EffectActions_EffectActionWithLevel = require('./EffectActions/EffectActionWithLevel.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('./EffectActions/LeveledEffectAction.cjs');
require('./EffectActions/SimpleEffectAction.cjs');
require('../../internal/Action.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/internalConstants.cjs');
require('../../internal/utils/objectFlip.cjs');

/**
 * @description Applies a colorizing filter to the asset, use the methods in the class to adjust the filter
 * @extends EffectActionWithLevel
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var ColorizeEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ColorizeEffectAction, _super);
    function ColorizeEffectAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @description The color to use for colorization. Specify HTML name or RGB hex code. (Server default: gray)
     * @param {string} color HTML name(red, green, etc.) or RGB hex code. (Server default: gray)
     * @return {this}
     */
    ColorizeEffectAction.prototype.color = function (color) {
        this._actionModel.color = color;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('co', new internal_qualifier_QualifierValue.QualifierValue(internal_utils_prepareColor.prepareColor(color))));
    };
    ColorizeEffectAction.fromJson = function (actionModel) {
        var _a = actionModel, actionType = _a.actionType, level = _a.level, color = _a.color;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(actionType, level);
        color && result.color(color);
        return result;
    };
    return ColorizeEffectAction;
}(actions_effect_EffectActions_EffectActionWithLevel.EffectActionWithLevel));

exports.ColorizeEffectAction = ColorizeEffectAction;
