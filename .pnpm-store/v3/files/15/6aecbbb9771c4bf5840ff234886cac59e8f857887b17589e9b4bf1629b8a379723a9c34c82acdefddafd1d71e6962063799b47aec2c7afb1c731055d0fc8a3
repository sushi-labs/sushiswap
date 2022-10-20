'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var actions_effect_EffectActions_LeveledEffectAction = require('../EffectActions/LeveledEffectAction.cjs');
var internal_qualifier_Qualifier = require('../../../internal/qualifier/Qualifier.cjs');
var internal_qualifier_QualifierValue = require('../../../internal/qualifier/QualifierValue.cjs');
var internal_utils_prepareColor = require('../../../internal/utils/prepareColor.cjs');
var internal_internalConstants = require('../../../internal/internalConstants.cjs');
require('../EffectActions/SimpleEffectAction.cjs');
require('../../../internal/Action.cjs');
require('../../../qualifiers/flag/FlagQualifier.cjs');
require('../../../internal/utils/dataStructureUtils.cjs');
require('../../../internal/models/ActionModel.cjs');
require('../../../internal/models/actionToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');
require('../../../internal/utils/objectFlip.cjs');

/**
 * @description Makes the background of the image transparent (or solid white for formats that do not support transparency).
 * @extends LeveledEffectAction
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var MakeTransparentEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(MakeTransparentEffectAction, _super);
    function MakeTransparentEffectAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._actionModel = { actionType: 'makeTransparent' };
        return _this;
    }
    /**
     * @description Sets the tolerance used to accommodate variance in the background color.
     * @param {number | string} value The tolerance used to accommodate variance in the background color. (Range: 0 to 100, Server default: 10)
     */
    MakeTransparentEffectAction.prototype.tolerance = function (value) {
        this._actionModel.tolerance = value;
        var qualifierEffect = this.createEffectQualifier(this.effectType, value);
        this.addQualifier(qualifierEffect);
        return this;
    };
    /**
     * @description Sets the color to make transparent.
     * @param {string} color The HTML name of the color (red, green, etc.) or RGB hex code.
     * @return {this}
     */
    MakeTransparentEffectAction.prototype.colorToReplace = function (color) {
        this._actionModel.color = color;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('co', new internal_qualifier_QualifierValue.QualifierValue(internal_utils_prepareColor.prepareColor(color))));
    };
    MakeTransparentEffectAction.fromJson = function (actionModel) {
        var _a = actionModel, actionType = _a.actionType, tolerance = _a.tolerance, color = _a.color;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(internal_internalConstants.ACTION_TYPE_TO_EFFECT_MODE_MAP[actionType], tolerance);
        tolerance && result.tolerance(tolerance);
        color && result.colorToReplace(color);
        return result;
    };
    return MakeTransparentEffectAction;
}(actions_effect_EffectActions_LeveledEffectAction.LeveledEffectAction));

exports.MakeTransparentEffectAction = MakeTransparentEffectAction;
