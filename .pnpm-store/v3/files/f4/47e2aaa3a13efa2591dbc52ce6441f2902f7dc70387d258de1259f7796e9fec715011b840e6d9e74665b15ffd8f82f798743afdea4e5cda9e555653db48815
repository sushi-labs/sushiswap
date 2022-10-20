'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../../internal/qualifier/Qualifier.cjs');
var internal_qualifier_QualifierValue = require('../../../internal/qualifier/QualifierValue.cjs');
require('../../../qualifiers/flag/FlagQualifier.cjs');
require('../../../internal/utils/dataStructureUtils.cjs');
require('../../../internal/models/ActionModel.cjs');
require('../../../internal/models/actionToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');

/**
 * @description Fade out at the end of the video, use the length() method to set the time in ms for the fade to occur. (Server default: 2000)
 * @extends LeveledEffectAction
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var FadeOutEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(FadeOutEffectAction, _super);
    function FadeOutEffectAction(duration) {
        var _this = _super.call(this) || this;
        _this._actionModel = { actionType: 'fadeOut' };
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', new internal_qualifier_QualifierValue.QualifierValue(['fade', "-" + duration]).setDelimiter(':')));
        duration && (_this._actionModel.length = duration);
        return _this;
    }
    /**
     *
     * @description Sets the duration level for the action
     * @param {string | number} duration - The duration of the effect
     */
    FadeOutEffectAction.prototype.duration = function (duration) {
        this._actionModel.length = duration;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', new internal_qualifier_QualifierValue.QualifierValue(['fade', "-" + duration]).setDelimiter(':')));
    };
    FadeOutEffectAction.fromJson = function (actionModel) {
        var length = actionModel.length;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(length);
        return result;
    };
    return FadeOutEffectAction;
}(internal_Action.Action));

exports.FadeOutEffectAction = FadeOutEffectAction;
