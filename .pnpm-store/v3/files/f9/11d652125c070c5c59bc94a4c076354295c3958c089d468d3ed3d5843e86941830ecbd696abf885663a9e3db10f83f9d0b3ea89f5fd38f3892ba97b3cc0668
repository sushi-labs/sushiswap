import IURLConfig from "./interfaces/Config/IURLConfig.js";
import Config from "./BaseConfig.js";
import ICloudConfig from "./interfaces/Config/ICloudConfig.js";
declare class URLConfig extends Config implements IURLConfig {
    cname?: string;
    secureDistribution?: string;
    privateCdn?: boolean;
    signUrl?: boolean;
    longUrlSignature?: boolean;
    shorten?: boolean;
    useRootPath?: boolean;
    secure?: boolean;
    forceVersion?: boolean;
    /**
     * @param {IURLConfig} userURLConfig
     */
    constructor(userURLConfig: IURLConfig | any);
    extend(userURLConfig: ICloudConfig | any): URLConfig;
    /**
     * @param {string} value Sets the cname
     */
    setCname(value: string): this;
    /**
     * @param {string} value Sets the secureDistribution
     */
    setSecureDistribution(value: string): this;
    /**
     * @param {boolean} value Sets whether to use a private CDN (Removes cloudName from URL)
     */
    setPrivateCdn(value: boolean): this;
    /**
     * @param value Sets whether or not to sign the URL
     */
    setSignUrl(value: boolean): this;
    /**
     * @param value Sets whether or not to use a long signature
     */
    setLongUrlSignature(value: boolean): this;
    /**
     * @param value Sets whether or not to shorten the URL
     */
    setShorten(value: boolean): this;
    /**
     * @param value Sets whether or not to use a root path
     */
    setUseRootPath(value: boolean): this;
    /**
     * @param value Sets whether or not to deliver the asset through https
     */
    setSecure(value: boolean): this;
    /**
     * @param value Sets whether to force a version in the URL
     */
    setForceVersion(value: boolean): this;
}
export default URLConfig;
