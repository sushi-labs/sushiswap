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
 * @description Removes small motion shifts from the video. with a maximum extent of movement in the horizontal and vertical direction of 32 pixels
 * @extends LeveledEffectAction
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var DeshakeEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(DeshakeEffectAction, _super);
    function DeshakeEffectAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._actionModel = { actionType: 'deshake' };
        return _this;
    }
    /**
     * The maximum number of pixels in the horizontal and vertical direction that will be addressed. (Possible values: 16, 32, 48, 64. Server default: 16)
     * @param value Possible values: 16, 32, 48, 64.  Server default: 16.
     */
    DeshakeEffectAction.prototype.shakeStrength = function (value) {
        this._actionModel.pixels = value;
        var qualifierEffect = this.createEffectQualifier(this.effectType, value);
        this.addQualifier(qualifierEffect);
        return this;
    };
    DeshakeEffectAction.fromJson = function (actionModel) {
        var _a = actionModel, actionType = _a.actionType, pixels = _a.pixels;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(actionType, pixels);
        return result;
    };
    return DeshakeEffectAction;
}(actions_effect_EffectActions_LeveledEffectAction.LeveledEffectAction));

exports.DeshakeEffectAction = DeshakeEffectAction;
