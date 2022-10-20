'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var actions_effect_EffectActions_LeveledEffectAction = require('../EffectActions/LeveledEffectAction.cjs');
require('../EffectActions/SimpleEffectAction.cjs');
require('../../../internal/Action.cjs');
require('../../../qualifiers/flag/FlagQualifier.cjs');
require('../../../internal/qualifier/QualifierValue.cjs');
require('../../../internal/qualifier/Qualifier.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');
require('../../../internal/utils/dataStructureUtils.cjs');
require('../../../internal/models/ActionModel.cjs');
require('../../../internal/models/actionToJson.cjs');
require('../../../internal/internalConstants.cjs');
require('../../../internal/utils/objectFlip.cjs');

/**
 * @description Delivers a video or animated GIF that contains additional loops of the video/GIF.
 * @extends LeveledEffectAction
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var LoopEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(LoopEffectAction, _super);
    function LoopEffectAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoopEffectAction.prototype.additionalIterations = function (value) {
        this._actionModel.iterations = value;
        var qualifierEffect = this.createEffectQualifier(this.effectType, value);
        this.addQualifier(qualifierEffect);
        return this;
    };
    LoopEffectAction.fromJson = function (actionModel) {
        var _a = (actionModel), actionType = _a.actionType, iterations = _a.iterations;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(actionType, iterations);
        return result;
    };
    return LoopEffectAction;
}(actions_effect_EffectActions_LeveledEffectAction.LeveledEffectAction));

exports.LoopEffectAction = LoopEffectAction;
