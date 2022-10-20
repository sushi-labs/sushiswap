import { Transformation } from "../transformation/Transformation.js";
import ICloudConfig from "../config/interfaces/Config/ICloudConfig.js";
import IURLConfig from "../config/interfaces/Config/IURLConfig.js";
import IAuthTokenConfig from "../config/interfaces/Config/IAuthTokenConfig.js";
import { ITrackedPropertiesThroughAnalytics } from "../sdkAnalytics/interfaces/ITrackedPropertiesThroughAnalytics.js";
/**
 * This const contains all the valid combination of asset/delivery for URL shortening purposes
 * It's exported because it's used in a test, but it's not really shared enough to belong in a separate file
 */
export declare const SEO_TYPES: Record<string, string>;
/**
 * Supported delivery type options.
 */
declare type DELIVERY_TYPE = 'key' | 'upload' | 'private_delivery' | 'public_delivery' | 'authenticated' | 'fetch' | 'sprite' | 'text' | 'multi' | 'facebook' | 'twitter' | 'twitter_name' | 'gravatar' | 'youtube' | 'hulu' | 'vimeo' | 'animoto' | 'worldstarhiphop' | 'dailymotion';
/**
 * @description Cloudinary file without a transformation
 * @summary SDK
 * @memberOf SDK
 */
declare class CloudinaryFile {
    protected assetType: string;
    protected cloudName: string;
    protected apiKey: string;
    protected apiSecret: string;
    protected authToken: IAuthTokenConfig;
    protected urlConfig: IURLConfig;
    private version;
    private publicID;
    private extension;
    private signature;
    private suffix;
    private deliveryType;
    constructor(publicID: string, cloudConfig?: ICloudConfig, urlConfig?: IURLConfig);
    /**
     * @description Sets the URL Config for this asset
     * @param urlConfig
     * @return {this}
     */
    setURLConfig(urlConfig: IURLConfig): this;
    /**
     * @description Sets the Cloud Config for this asset
     * @param urlConfig
     * @return {this}
     */
    setCloudConfig(cloudConfig: ICloudConfig): this;
    /**
     * @description Sets the public ID of the asset.
     * @param {string} publicID The public ID of the asset.
     * @return {this}
     */
    setPublicID(publicID: string): this;
    /**
     * @description Sets the delivery type of the asset.
     * @param {DELIVERY_TYPE | string} newType The type of the asset.
     * @return {this}
     */
    setDeliveryType(newType: DELIVERY_TYPE | string): this;
    /**
     * @description Sets the URL SEO suffix of the asset.
     * @param {string} newSuffix The SEO suffix.
     * @return {this}
     */
    setSuffix(newSuffix: string): this;
    /**
     * @description Sets the signature of the asset.
     * @param {string} signature The signature.
     * @return {this}
     */
    setSignature(signature: string): this;
    /**
     * @description Sets the version of the asset.
     * @param {string} newVersion The version of the asset.
     * @return {this}
     */
    setVersion(newVersion: number | string): this;
    /**
     * @description Sets the asset type.
     * @param {string} newType The type of the asset.
     * @return {this}
     */
    setAssetType(newType: 'key' | 'image' | 'video' | 'raw' | 'auto' | 'all' | string): this;
    sign(): this;
    /**
     * @description Serializes to URL string
     * @param overwriteOptions
     */
    toURL(overwriteOptions?: {
        trackedAnalytics?: Partial<ITrackedPropertiesThroughAnalytics>;
    }): string;
    /**
     * @description Validate various options before attempting to create a URL
     * The function will throw in case a violation
     * @throws Validation errors
     */
    validateAssetForURLCreation(): void;
    /**
     * @description return an SEO friendly name for a combination of asset/delivery, some examples:
     * * image/upload -> images
     * * video/upload -> videos
     * If no match is found, return `{asset}/{delivery}`
     */
    getResourceType(): string;
    getSignature(): string;
    /**
     *
     * @description Creates a fully qualified CloudinaryURL
     * @return {string} CloudinaryURL
     * @throws Validation Errors
     */
    createCloudinaryURL(transformation?: Transformation | string, trackedAnalytics?: Partial<ITrackedPropertiesThroughAnalytics>): string;
}
export { CloudinaryFile };
