import IAuthTokenConfig from "./IAuthTokenConfig.js";
/**
 * @name ICloudConfig
 * @summary config
 * @description Defines the global configuration applied when generating Cloudinary URLs.
 * @prop {string} [cloudName]
 * @prop {string} [apiKey]
 * @prop {string} [apiSecret]
 * @prop {IAuthTokenConfig} [authToken]
 * @example
 * import Cloudinary from '@cloudinary/url-gen';
 * // The Cloudinary Instance accepts a CloudConfig under the `cloud` key
 * const cld = new Cloudinary({
 *  // the cloudConfig
 *  cloud: {
 *       cloudName: 'demo'
 *   },
 *   // the urlConfig
 *   url: {
 *         // ... urlConfig is optional.
 *   }
 * });
 */
interface ICloudConfig {
    cloudName?: string;
    apiKey?: string;
    apiSecret?: string;
    authToken?: IAuthTokenConfig;
}
export default ICloudConfig;
