'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var assets_CloudinaryTransformable = require('./CloudinaryTransformable.cjs');
var transformation_VideoTransformation = require('../transformation/VideoTransformation.cjs');
require('./CloudinaryFile.cjs');
require('../internal/url/cloudinaryURL.cjs');
require('../internal/url/urlUtils/isUrl.cjs');
require('../internal/url/urlUtils/isFileName.cjs');
require('../internal/url/urlUtils/publicIDContainsVersion.cjs');
require('../config/URLConfig.cjs');
require('../config/BaseConfig.cjs');
require('../internal/internalConstants.cjs');
require('../internal/utils/objectFlip.cjs');
require('../sdkAnalytics/getSDKAnalyticsSignature.cjs');
require('../sdkAnalytics/encodeVersion.cjs');
require('../sdkAnalytics/base64Map.cjs');
require('../sdkAnalytics/stringPad.cjs');
require('../sdkAnalytics/reverseVersion.cjs');
require('../sdkAnalytics/getAnalyticsOptions.cjs');
require('../internal/utils/packageVersion.cjs');
require('../actions/delivery/DeliveryFormatAction.cjs');
require('../qualifiers/flag.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../actions/delivery/DeliveryAction.cjs');
require('../internal/Action.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');
require('../qualifiers/format/FormatQualifier.cjs');
require('../qualifiers/progressive.cjs');
require('../transformation/Transformation.cjs');
require('../actions/background/actions/BackgroundColor.cjs');
require('../internal/utils/prepareColor.cjs');
require('../internal/RawAction.cjs');
require('../internal/models/IErrorObject.cjs');

/**
 * @desc Cloudinary video asset, with video-related transformations
 * @summary SDK
 * @memberOf SDK
 */
var CloudinaryVideo = /** @class */ (function (_super) {
    tslib_es6.__extends(CloudinaryVideo, _super);
    function CloudinaryVideo(publicID, cloudConfig, urlConfig) {
        var _this = 
        /* istanbul ignore next */
        _super.call(this, publicID, cloudConfig, urlConfig, new transformation_VideoTransformation.VideoTransformation()) || this;
        _this.assetType = 'video';
        return _this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Transcode} action
     * @return {this}
     */
    CloudinaryVideo.prototype.transcode = function (action) {
        this.transformation.transcode(action);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.VideoEdit} action
     * @return {this}
     */
    CloudinaryVideo.prototype.videoEdit = function (action) {
        this.transformation.videoEdit(action);
        return this;
    };
    return CloudinaryVideo;
}(assets_CloudinaryTransformable.CloudinaryTransformable));

exports.CloudinaryVideo = CloudinaryVideo;
