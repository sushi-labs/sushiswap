'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @description Class to Controls the volume of an audio or video file.
 * @extends SDK.Action
 * @memberOf Actions.VideoEdit
 * @see Visit {@link Actions.VideoEdit|VideoEdit} for an example
 */
var VolumeAction = /** @class */ (function (_super) {
    tslib_es6.__extends(VolumeAction, _super);
    function VolumeAction(volumeValue) {
        var _this = _super.call(this) || this;
        var volumeValueModel = { mode: 'mute' };
        if (volumeValue !== 'mute') {
            volumeValueModel = {
                mode: (("" + volumeValue).endsWith('db') ? 'decibels' : 'percent'),
                value: +(("" + volumeValue).replace('db', ''))
            };
        }
        _this._actionModel = {
            actionType: 'volume',
            volumeValue: volumeValueModel
        };
        var qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(['volume', volumeValue]).setDelimiter(':');
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', qualifierValue));
        return _this;
    }
    VolumeAction.fromJson = function (actionModel) {
        var volumeValue = actionModel.volumeValue;
        var mode = volumeValue.mode;
        var value = mode === 'mute' ? mode : volumeValue.value;
        var suffix = (mode === 'mute' || mode === "percent") ? '' : 'db';
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        return new this("" + value + suffix);
    };
    return VolumeAction;
}(internal_Action.Action));

module.exports = VolumeAction;
