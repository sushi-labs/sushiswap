import IURLConfig from "./IURLConfig.js";
import ICloudConfig from "./ICloudConfig.js";
/**
 * @name ICloudinaryAssetConfigurations
 * @summary config
 * @description Defines the configuration needed to create URLs for cloudinary assets
 *
 * @prop {ICloudConfig} cloud
 * @prop {IURLConfig} url
 * @example
 * import Cloudinary from '@cloudinary/url-gen';
 * // The Cloudinary Instance accepts an ICloudinaryAssetConfigurations as an argument
 * // ICloudinaryAssetConfigurations is built from two parts, the `cloud` and the `url` keys.
 * const cld = new Cloudinary({
 *  // the cloudConfig
 *  cloud: {
 *       cloudName: 'demo'
 *   },
 *   // the urlConfig
 *   url: {
 *       cname: 'www.example.com',
 *       forceVersion: true
 *   }
 * });
 */
interface ICloudinaryAssetConfigurations {
    cloud?: ICloudConfig;
    url?: IURLConfig;
}
export default ICloudinaryAssetConfigurations;
