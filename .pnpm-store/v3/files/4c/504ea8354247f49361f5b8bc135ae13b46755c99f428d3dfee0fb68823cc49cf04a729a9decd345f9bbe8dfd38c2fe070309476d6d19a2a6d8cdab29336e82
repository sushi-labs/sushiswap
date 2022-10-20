'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var assets_CloudinaryImage = require('../assets/CloudinaryImage.cjs');
var assets_CloudinaryVideo = require('../assets/CloudinaryVideo.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../transformation/ImageTransformation.cjs');
require('../transformation/Transformation.cjs');
require('../internal/Action.cjs');
require('../qualifiers/flag/FlagQualifier.cjs');
require('../internal/qualifier/QualifierValue.cjs');
require('../internal/qualifier/Qualifier.cjs');
require('../internal/models/QualifierModel.cjs');
require('../internal/models/qualifierToJson.cjs');
require('../internal/utils/unsupportedError.cjs');
require('../internal/utils/dataStructureUtils.cjs');
require('../internal/models/ActionModel.cjs');
require('../internal/models/actionToJson.cjs');
require('../actions/background/actions/BackgroundColor.cjs');
require('../internal/utils/prepareColor.cjs');
require('../internal/RawAction.cjs');
require('../internal/models/IErrorObject.cjs');
require('../assets/CloudinaryTransformable.cjs');
require('../assets/CloudinaryFile.cjs');
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
require('../actions/delivery/DeliveryAction.cjs');
require('../qualifiers/format/FormatQualifier.cjs');
require('../qualifiers/progressive.cjs');
require('../transformation/VideoTransformation.cjs');

var Cloudinary = /** @class */ (function () {
    function Cloudinary(cloudinaryConfig) {
        if (cloudinaryConfig) {
            this.cloudinaryConfig = cloudinaryConfig;
        }
    }
    Cloudinary.prototype.image = function (publicID) {
        return new assets_CloudinaryImage.CloudinaryImage(publicID, this.cloudinaryConfig.cloud, this.cloudinaryConfig.url);
    };
    Cloudinary.prototype.video = function (publicID) {
        return new assets_CloudinaryVideo.CloudinaryVideo(publicID, this.cloudinaryConfig.cloud, this.cloudinaryConfig.url);
    };
    Cloudinary.prototype.setConfig = function (cloudinaryConfig) {
        this.cloudinaryConfig = cloudinaryConfig;
        return this;
    };
    Cloudinary.prototype.getConfig = function () {
        return this.cloudinaryConfig;
    };
    Cloudinary.prototype.extendConfig = function () {
        // Future implementation
    };
    return Cloudinary;
}());

exports.Cloudinary = Cloudinary;
