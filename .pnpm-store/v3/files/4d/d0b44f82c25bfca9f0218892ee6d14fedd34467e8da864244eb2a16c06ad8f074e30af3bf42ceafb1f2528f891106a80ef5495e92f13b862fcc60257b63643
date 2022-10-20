'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var actions_effect_EffectActions_LeveledEffectAction = require('./EffectActions/LeveledEffectAction.cjs');
require('./EffectActions/SimpleEffectAction.cjs');
require('../../internal/Action.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/qualifier/Qualifier.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/internalConstants.cjs');
require('../../internal/utils/objectFlip.cjs');

/**
 * @description Applies an ordered dither filter to the image.
 * @extends LeveledEffectAction
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var DitherEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(DitherEffectAction, _super);
    function DitherEffectAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._actionModel = { actionType: 'dither' };
        return _this;
    }
    /**
     *
     * @param {Qualifiers.Dither} ditherType - The dither type applied to the image
     * @return {this}
     */
    DitherEffectAction.prototype.type = function (ditherType) {
        this._actionModel.type = ditherType;
        var qualifierEffect = this.createEffectQualifier(this.effectType, ditherType);
        this.addQualifier(qualifierEffect);
        return this;
    };
    DitherEffectAction.fromJson = function (actionModel) {
        var _a = actionModel, actionType = _a.actionType, type = _a.type;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(actionType);
        type && result.type(type);
        return result;
    };
    return DitherEffectAction;
}(actions_effect_EffectActions_LeveledEffectAction.LeveledEffectAction));

exports.DitherEffectAction = DitherEffectAction;
