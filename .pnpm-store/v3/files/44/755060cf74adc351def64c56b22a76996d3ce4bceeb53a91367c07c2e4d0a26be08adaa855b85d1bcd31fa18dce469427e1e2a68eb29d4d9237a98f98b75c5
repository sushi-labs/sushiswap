'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var actions_effect_EffectActions_SimpleEffectAction = require('./SimpleEffectAction.cjs');
var internal_internalConstants = require('../../../internal/internalConstants.cjs');
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
require('../../../internal/utils/objectFlip.cjs');

/**
 * @description A base class for effects with a level, the extending class needs to implement a method that calls setLevel()
 * @extends {Actions.Effect.SimpleEffectAction}
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var LeveledEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(LeveledEffectAction, _super);
    function LeveledEffectAction(effectType, level) {
        var _this = _super.call(this, effectType, level) || this;
        _this.LEVEL_NAME = 'level';
        _this._actionModel = {};
        _this.effectType = effectType;
        _this._actionModel.actionType = internal_internalConstants.EFFECT_MODE_TO_ACTION_TYPE_MAP[effectType] || effectType;
        if (level) {
            _this.setLevel(level);
        }
        return _this;
    }
    /**
     *
     * @description Sets the effect level for the action
     * @param {string | number} level - The strength of the effect
     * @protected
     */
    LeveledEffectAction.prototype.setLevel = function (level) {
        this._actionModel[this.LEVEL_NAME] = level;
        var qualifierEffect = this.createEffectQualifier(this.effectType, level);
        this.addQualifier(qualifierEffect);
        return this;
    };
    return LeveledEffectAction;
}(actions_effect_EffectActions_SimpleEffectAction.SimpleEffectAction));

exports.LeveledEffectAction = LeveledEffectAction;
