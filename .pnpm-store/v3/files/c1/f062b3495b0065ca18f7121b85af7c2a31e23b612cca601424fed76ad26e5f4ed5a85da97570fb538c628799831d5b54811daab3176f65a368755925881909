'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_internalConstants = require('../../internal/internalConstants.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/objectFlip.cjs');

/**
 * @extends SDK.Action
 * @memberOf Actions.Transcode
 * @description The predefined streaming profiles.
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#predefined_streaming_profiles|Predefined streaming profiles}
 * @see Visit {@link Actions.Transcode|Transcode} for an example
 */
var StreamingProfileAction = /** @class */ (function (_super) {
    tslib_es6.__extends(StreamingProfileAction, _super);
    function StreamingProfileAction(profile) {
        var _this = _super.call(this) || this;
        _this._actionModel = { actionType: 'streamingProfile' };
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('sp', profile));
        _this._actionModel.profile = internal_internalConstants.STREAMING_PROFILE_TO_ACTION_TYPE_MAP[profile] || profile;
        return _this;
    }
    StreamingProfileAction.fromJson = function (actionModel) {
        var profile = actionModel.profile;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var profileType = internal_internalConstants.ACTION_TYPE_TO_STREAMING_PROFILE_MODE_MAP[profile] || profile;
        var result = new this(profileType);
        return result;
    };
    return StreamingProfileAction;
}(internal_Action.Action));

module.exports = StreamingProfileAction;
