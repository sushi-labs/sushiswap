'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description Controls the audio codec or removes the audio channel.
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/audio_transformations#audio_frequency_control|Audio codec settings}
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
var AudioCodecAction = /** @class */ (function (_super) {
    tslib_es6.__extends(AudioCodecAction, _super);
    function AudioCodecAction(codec) {
        var _this = _super.call(this) || this;
        _this._actionModel = { actionType: 'audioCodec' };
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('ac', codec));
        _this._actionModel.audioCodec = codec;
        return _this;
    }
    AudioCodecAction.fromJson = function (actionModel) {
        var audioCodec = actionModel.audioCodec;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(audioCodec);
        return result;
    };
    return AudioCodecAction;
}(internal_Action.Action));

module.exports = AudioCodecAction;
