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
 * @description A class for all effects that include a blendPercentage method
 * @extends {Actions.Effect.LeveledEffectAction}
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var EffectActionWithBlend = /** @class */ (function (_super) {
    tslib_es6.__extends(EffectActionWithBlend, _super);
    function EffectActionWithBlend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EffectActionWithBlend.prototype.blend = function (value) {
        return this.setLevel(value);
    };
    return EffectActionWithBlend;
}(actions_effect_EffectActions_LeveledEffectAction.LeveledEffectAction));

exports.EffectActionWithBlend = EffectActionWithBlend;
