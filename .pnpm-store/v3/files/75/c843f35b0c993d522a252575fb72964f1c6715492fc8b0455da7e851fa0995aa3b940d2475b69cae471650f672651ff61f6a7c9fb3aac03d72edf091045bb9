import { isUrl } from "./urlUtils/isUrl.js";
import { isFileName } from "./urlUtils/isFileName.js";
import { publicIDContainsVersion } from "./urlUtils/publicIDContainsVersion.js";
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
    const secure = urlConfig.secure;
    const privateCDN = urlConfig.privateCdn;
    const cname = urlConfig.cname;
    const secureDistribution = urlConfig.secureDistribution;
    if (!secure && !cname) {
        return `http://res.cloudinary.com/${cloudName}`;
    }
    if (secure && !secureDistribution && privateCDN) {
        return `https://${cloudName}-res.cloudinary.com`;
    }
    if (secure && !secureDistribution) {
        return `https://res.cloudinary.com/${cloudName}`;
    }
    if (secure && secureDistribution && privateCDN) {
        return `https://${secureDistribution}`;
    }
    if (secure && secureDistribution) {
        return `https://${secureDistribution}/${cloudName}`;
    }
    if (!secure && cname) {
        return `http://${cname}/${cloudName}`;
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
    const shouldForceVersion = forceVersion !== false;
    if (version) {
        return `v${version}`;
    }
    // In all these conditions we never force a version
    if (publicIDContainsVersion(publicID) || isUrl(publicID) || isFileName(publicID)) {
        return '';
    }
    return shouldForceVersion ? 'v1' : '';
}
export { handleAssetType, getUrlVersion, handleDeliveryType, getUrlPrefix };
