import Config from "./BaseConfig.js";
import { ALLOWED_URL_CONFIG } from "../internal/internalConstants.js";
class URLConfig extends Config {
    /**
     * @param {IURLConfig} userURLConfig
     */
    constructor(userURLConfig) {
        super();
        const urlConfig = this.filterOutNonSupportedKeys(userURLConfig, ALLOWED_URL_CONFIG);
        Object.assign(this, {
            secure: true
        }, urlConfig);
    }
    extend(userURLConfig) {
        const urlConfig = this.filterOutNonSupportedKeys(userURLConfig, ALLOWED_URL_CONFIG);
        return new URLConfig(Object.assign({}, this, urlConfig));
    }
    /**
     * @param {string} value Sets the cname
     */
    setCname(value) {
        this.cname = value;
        return this;
    }
    /**
     * @param {string} value Sets the secureDistribution
     */
    setSecureDistribution(value) {
        this.secureDistribution = value;
        return this;
    }
    /**
     * @param {boolean} value Sets whether to use a private CDN (Removes cloudName from URL)
     */
    setPrivateCdn(value) {
        this.privateCdn = value;
        return this;
    }
    /**
     * @param value Sets whether or not to sign the URL
     */
    setSignUrl(value) {
        this.signUrl = value;
        return this;
    }
    /**
     * @param value Sets whether or not to use a long signature
     */
    setLongUrlSignature(value) {
        this.longUrlSignature = value;
        return this;
    }
    /**
     * @param value Sets whether or not to shorten the URL
     */
    setShorten(value) {
        this.shorten = value;
        return this;
    }
    /**
     * @param value Sets whether or not to use a root path
     */
    setUseRootPath(value) {
        this.useRootPath = value;
        return this;
    }
    /**
     * @param value Sets whether or not to deliver the asset through https
     */
    setSecure(value) {
        this.secure = value;
        return this;
    }
    /**
     * @param value Sets whether to force a version in the URL
     */
    setForceVersion(value) {
        this.forceVersion = value;
        return this;
    }
}
export default URLConfig;
