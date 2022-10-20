'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var internal_url_cloudinaryURL = require('../internal/url/cloudinaryURL.cjs');
var config_URLConfig = require('../config/URLConfig.cjs');
var sdkAnalytics_getSDKAnalyticsSignature = require('../sdkAnalytics/getSDKAnalyticsSignature.cjs');
require('../internal/url/urlUtils/isUrl.cjs');
require('../internal/url/urlUtils/isFileName.cjs');
require('../internal/url/urlUtils/publicIDContainsVersion.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../config/BaseConfig.cjs');
require('../internal/internalConstants.cjs');
require('../internal/utils/objectFlip.cjs');
require('../sdkAnalytics/encodeVersion.cjs');
require('../sdkAnalytics/base64Map.cjs');
require('../sdkAnalytics/stringPad.cjs');
require('../sdkAnalytics/reverseVersion.cjs');
require('../sdkAnalytics/getAnalyticsOptions.cjs');
require('../internal/utils/packageVersion.cjs');

/**
 * This const contains all the valid combination of asset/delivery for URL shortening purposes
 * It's exported because it's used in a test, but it's not really shared enough to belong in a separate file
 */
var SEO_TYPES = {
    "image/upload": "images",
    "image/private": "private_images",
    "image/authenticated": "authenticated_images",
    "raw/upload": "files",
    "video/upload": "videos"
};
/**
 * @description Cloudinary file without a transformation
 * @summary SDK
 * @memberOf SDK
 */
var CloudinaryFile = /** @class */ (function () {
    function CloudinaryFile(publicID, cloudConfig, urlConfig) {
        if (cloudConfig === void 0) { cloudConfig = {}; }
        this.setPublicID(publicID);
        this.setCloudConfig(cloudConfig);
        this.setURLConfig(urlConfig);
    }
    /**
     * @description Sets the URL Config for this asset
     * @param urlConfig
     * @return {this}
     */
    CloudinaryFile.prototype.setURLConfig = function (urlConfig) {
        this.urlConfig = new config_URLConfig(urlConfig);
        return this;
    };
    /**
     * @description Sets the Cloud Config for this asset
     * @param urlConfig
     * @return {this}
     */
    CloudinaryFile.prototype.setCloudConfig = function (cloudConfig) {
        this.cloudName = cloudConfig.cloudName;
        this.apiKey = cloudConfig.apiKey;
        this.apiSecret = cloudConfig.apiSecret;
        this.authToken = cloudConfig.authToken;
        return this;
    };
    /**
     * @description Sets the public ID of the asset.
     * @param {string} publicID The public ID of the asset.
     * @return {this}
     */
    CloudinaryFile.prototype.setPublicID = function (publicID) {
        // PublicID must be a string!
        this.publicID = publicID ? publicID.toString() : '';
        return this;
    };
    /**
     * @description Sets the delivery type of the asset.
     * @param {DELIVERY_TYPE | string} newType The type of the asset.
     * @return {this}
     */
    CloudinaryFile.prototype.setDeliveryType = function (newType) {
        this.deliveryType = newType;
        return this;
    };
    /**
     * @description Sets the URL SEO suffix of the asset.
     * @param {string} newSuffix The SEO suffix.
     * @return {this}
     */
    CloudinaryFile.prototype.setSuffix = function (newSuffix) {
        this.suffix = newSuffix;
        return this;
    };
    /**
     * @description Sets the signature of the asset.
     * @param {string} signature The signature.
     * @return {this}
     */
    CloudinaryFile.prototype.setSignature = function (signature) {
        this.signature = signature;
        return this;
    };
    /**
     * @description Sets the version of the asset.
     * @param {string} newVersion The version of the asset.
     * @return {this}
     */
    CloudinaryFile.prototype.setVersion = function (newVersion) {
        if (newVersion) {
            this.version = newVersion;
        }
        return this;
    };
    /**
     * @description Sets the asset type.
     * @param {string} newType The type of the asset.
     * @return {this}
     */
    CloudinaryFile.prototype.setAssetType = function (newType) {
        if (newType) {
            this.assetType = newType;
        }
        return this;
    };
    CloudinaryFile.prototype.sign = function () {
        return this;
    };
    /**
     * @description Serializes to URL string
     * @param overwriteOptions
     */
    CloudinaryFile.prototype.toURL = function (overwriteOptions) {
        if (overwriteOptions === void 0) { overwriteOptions = {}; }
        return this.createCloudinaryURL(null, overwriteOptions.trackedAnalytics);
    };
    /**
     * @description Validate various options before attempting to create a URL
     * The function will throw in case a violation
     * @throws Validation errors
     */
    CloudinaryFile.prototype.validateAssetForURLCreation = function () {
        if (typeof this.cloudName === 'undefined') {
            throw 'You must supply a cloudName when initializing the asset';
        }
        var suffixContainsDot = this.suffix && this.suffix.indexOf('.') >= 0;
        var suffixContainsSlash = this.suffix && this.suffix.indexOf('/') >= 0;
        if (suffixContainsDot || suffixContainsSlash) {
            throw '`suffix`` should not include . or /';
        }
    };
    /**
     * @description return an SEO friendly name for a combination of asset/delivery, some examples:
     * * image/upload -> images
     * * video/upload -> videos
     * If no match is found, return `{asset}/{delivery}`
     */
    CloudinaryFile.prototype.getResourceType = function () {
        var assetType = internal_url_cloudinaryURL.handleAssetType(this.assetType);
        var deliveryType = internal_url_cloudinaryURL.handleDeliveryType(this.deliveryType);
        var hasSuffix = !!this.suffix;
        var regularSEOType = assetType + "/" + deliveryType;
        var shortSEOType = SEO_TYPES[assetType + "/" + deliveryType];
        var useRootPath = this.urlConfig.useRootPath;
        var shorten = this.urlConfig.shorten;
        // Quick exit incase of useRootPath
        if (useRootPath) {
            if (regularSEOType === 'image/upload') {
                return ''; // For image/upload we're done, just return nothing
            }
            else {
                throw new Error("useRootPath can only be used with assetType: 'image' and deliveryType: 'upload'. Provided: " + regularSEOType + " instead");
            }
        }
        if (shorten && regularSEOType === 'image/upload') {
            return 'iu';
        }
        if (hasSuffix) {
            if (shortSEOType) {
                return shortSEOType;
            }
            else {
                throw new Error("URL Suffix only supported for " + Object.keys(SEO_TYPES).join(', ') + ", Provided: " + regularSEOType + " instead");
            }
        }
        // If all else fails, return the regular image/upload combination (asset/delivery)
        return regularSEOType;
    };
    CloudinaryFile.prototype.getSignature = function () {
        if (this.signature) {
            return "s--" + this.signature + "--";
        }
        else {
            return '';
        }
    };
    /**
     *
     * @description Creates a fully qualified CloudinaryURL
     * @return {string} CloudinaryURL
     * @throws Validation Errors
     */
    CloudinaryFile.prototype.createCloudinaryURL = function (transformation, trackedAnalytics) {
        // In accordance with the existing implementation, if no publicID exists we should return nothing.
        if (!this.publicID) {
            return '';
        }
        // Throws if some options are mis-configured
        // See the function for more information on when it throws
        this.validateAssetForURLCreation();
        var prefix = internal_url_cloudinaryURL.getUrlPrefix(this.cloudName, this.urlConfig);
        var transformationString = transformation ? transformation.toString() : '';
        var version = internal_url_cloudinaryURL.getUrlVersion(this.publicID, this.version, this.urlConfig.forceVersion);
        var publicID = this.publicID
            // Serialize the publicID, but leave slashes alone.
            // we can't use serializeCloudinaryCharacters because that does both things (, and /)
            .replace(/,/g, '%2C');
        // Resource type is a mixture of assetType, deliveryType and various URL Configurations
        // Note how `suffix` changes both image/upload (resourceType) and also is appended at the end
        var url = [prefix, this.getResourceType(), this.getSignature(), transformationString, version, publicID, this.suffix]
            .filter(function (a) { return a; })
            .join('/');
        if (typeof transformation === 'string') {
            return url;
        }
        else {
            var safeURL = encodeURI(url)
                .replace(/\?/g, '%3F')
                .replace(/=/g, '%3D');
            // urlConfig.analytics is true by default, has to be explicitly set to false to overwrite
            // Don't add analytics when publicId includes a '?' to not risk changing existing query params
            if (this.urlConfig.analytics !== false && !(publicID.includes('?'))) {
                return safeURL + "?_a=" + sdkAnalytics_getSDKAnalyticsSignature.getSDKAnalyticsSignature(trackedAnalytics);
            }
            else {
                return safeURL;
            }
        }
    };
    return CloudinaryFile;
}());

exports.CloudinaryFile = CloudinaryFile;
exports.SEO_TYPES = SEO_TYPES;
