'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var transformation_ImageTransformation = require('../transformation/ImageTransformation.cjs');
var assets_CloudinaryTransformable = require('./CloudinaryTransformable.cjs');
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
require('../actions/delivery/DeliveryAction.cjs');
require('../qualifiers/format/FormatQualifier.cjs');
require('../qualifiers/progressive.cjs');

/**
 * @desc Cloudinary image asset, with image-related transformations
 * @summary SDK
 * @memberOf SDK
 */
var CloudinaryImage = /** @class */ (function (_super) {
    tslib_es6.__extends(CloudinaryImage, _super);
    function CloudinaryImage(publicID, cloudConfig, urlConfig) {
        /* istanbul ignore next */
        return _super.call(this, publicID, cloudConfig, urlConfig, new transformation_ImageTransformation.ImageTransformation()) || this;
    }
    return CloudinaryImage;
}(assets_CloudinaryTransformable.CloudinaryTransformable));

exports.CloudinaryImage = CloudinaryImage;
