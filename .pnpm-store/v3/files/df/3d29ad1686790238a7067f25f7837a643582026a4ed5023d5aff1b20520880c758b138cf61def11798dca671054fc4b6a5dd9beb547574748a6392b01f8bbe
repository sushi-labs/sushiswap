'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var internal_url_urlUtils_isUrl = require('./urlUtils/isUrl.cjs');
var internal_url_urlUtils_isFileName = require('./urlUtils/isFileName.cjs');
var internal_url_urlUtils_publicIDContainsVersion = require('./urlUtils/publicIDContainsVersion.cjs');

/**
 * Create the URL prefix for Cloudinary resources.
 * Available use cases
 * http://res.cloudinary.com/{cloudName}
 * https://res.cloudinary.com/{cloudName}
 * https://{cloudName}-res.cloudinary.com/
 * http://{domain}/${cloudName}
 * https://{domain}/${cloudName}
 * https://{domain}
 * @private
 *
 * @param {string} cloudName
 * @param {IURLConfig} urlConfig
 */
function getUrlPrefix(cloudName, urlConfig) {
    var secure = urlConfig.secure;
    var privateCDN = urlConfig.privateCdn;
    var cname = urlConfig.cname;
    var secureDistribution = urlConfig.secureDistribution;
    if (!secure && !cname) {
        return "http://res.cloudinary.com/" + cloudName;
    }
    if (secure && !secureDistribution && privateCDN) {
        return "https://" + cloudName + "-res.cloudinary.com";
    }
    if (secure && !secureDistribution) {
        return "https://res.cloudinary.com/" + cloudName;
    }
    if (secure && secureDistribution && privateCDN) {
        return "https://" + secureDistribution;
    }
    if (secure && secureDistribution) {
        return "https://" + secureDistribution + "/" + cloudName;
    }
    if (!secure && cname) {
        return "http://" + cname + "/" + cloudName;
    }
    else {
        return 'ERROR';
    }
}
/**
 * @private
 * @param assetType
 */
function handleAssetType(assetType) {
    //default to image
    if (!assetType) {
        return 'image';
    }
    return assetType;
}
/**
 * @private
 * @param deliveryType
 */
function handleDeliveryType(deliveryType) {
    //default to upload
    if (!deliveryType) {
        return 'upload';
    }
    return deliveryType;
}
/**
 *
 * @param {string} publicID
 * @param {number} version
 * @param {boolean} forceVersion
 */
function getUrlVersion(publicID, version, forceVersion) {
    var shouldForceVersion = forceVersion !== false;
    if (version) {
        return "v" + version;
    }
    // In all these conditions we never force a version
    if (internal_url_urlUtils_publicIDContainsVersion.publicIDContainsVersion(publicID) || internal_url_urlUtils_isUrl.isUrl(publicID) || internal_url_urlUtils_isFileName.isFileName(publicID)) {
        return '';
    }
    return shouldForceVersion ? 'v1' : '';
}

exports.getUrlPrefix = getUrlPrefix;
exports.getUrlVersion = getUrlVersion;
exports.handleAssetType = handleAssetType;
exports.handleDeliveryType = handleDeliveryType;
