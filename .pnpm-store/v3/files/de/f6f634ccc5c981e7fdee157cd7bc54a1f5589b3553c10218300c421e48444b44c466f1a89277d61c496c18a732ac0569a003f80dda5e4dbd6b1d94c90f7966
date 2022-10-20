import IURLConfig from "../../config/interfaces/Config/IURLConfig.js";
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
declare function getUrlPrefix(cloudName: string, urlConfig: IURLConfig): string;
/**
 * @private
 * @param assetType
 */
declare function handleAssetType(assetType: string): string;
/**
 * @private
 * @param deliveryType
 */
declare function handleDeliveryType(deliveryType: string): string;
/**
 *
 * @param {string} publicID
 * @param {number} version
 * @param {boolean} forceVersion
 */
declare function getUrlVersion(publicID: string, version: number | string, forceVersion: boolean): string;
export { handleAssetType, getUrlVersion, handleDeliveryType, getUrlPrefix };
