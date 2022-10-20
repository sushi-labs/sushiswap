'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var assets_CloudinaryTransformable = require('./CloudinaryTransformable.cjs');
var transformation_Transformation = require('../transformation/Transformation.cjs');
var internal_utils_cloneDeep = require('../internal/utils/cloneDeep.cjs');
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
require('../actions/background/actions/BackgroundColor.cjs');
require('../internal/utils/prepareColor.cjs');
require('../internal/RawAction.cjs');
require('../internal/models/IErrorObject.cjs');

/**
 * @desc Cloudinary media asset, with all possible transformations
 * @summary SDK
 * @memberOf SDK
 */
var CloudinaryMedia = /** @class */ (function (_super) {
    tslib_es6.__extends(CloudinaryMedia, _super);
    function CloudinaryMedia(publicID, cloudConfig, urlConfig) {
        /* istanbul ignore next */
        return _super.call(this, publicID, cloudConfig, urlConfig, new transformation_Transformation.Transformation()) || this;
    }
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.Transcode} action
     * @return {this}
     */
    CloudinaryMedia.prototype.transcode = function (action) {
        this.transformation.transcode(action);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @param {Actions.VideoEdit} action
     * @return {this}
     */
    CloudinaryMedia.prototype.videoEdit = function (action) {
        this.transformation.videoEdit(action);
        return this;
    };
    /**
     * @desc A proxy to {@link SDK.Transformation| Transformation} - Calls the same method contained in this.transformation
     * @return {this}
     */
    CloudinaryMedia.prototype.underlay = function (underlayAction) {
        this.transformation.underlay(underlayAction);
        return this;
    };
    CloudinaryMedia.prototype.clone = function () {
        return internal_utils_cloneDeep.cloneDeep(this);
    };
    return CloudinaryMedia;
}(assets_CloudinaryTransformable.CloudinaryTransformable));

exports.CloudinaryMedia = CloudinaryMedia;
