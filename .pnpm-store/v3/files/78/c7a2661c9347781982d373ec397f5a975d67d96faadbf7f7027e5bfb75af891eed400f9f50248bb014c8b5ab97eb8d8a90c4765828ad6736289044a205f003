'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var actions_effect_EffectActions_LeveledEffectAction = require('./LeveledEffectAction.cjs');
require('./SimpleEffectAction.cjs');
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
 * @description A class that provides a built in level() method that sets the level of the effect
 * @extends {Actions.Effect.LeveledEffectAction}
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var EffectActionWithLevel = /** @class */ (function (_super) {
    tslib_es6.__extends(EffectActionWithLevel, _super);
    function EffectActionWithLevel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EffectActionWithLevel.prototype.level = function (value) {
        this._actionModel.level = value;
        return this.setLevel(value);
    };
    return EffectActionWithLevel;
}(actions_effect_EffectActions_LeveledEffectAction.LeveledEffectAction));

exports.EffectActionWithLevel = EffectActionWithLevel;
