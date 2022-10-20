import { ALLOWED_CLOUD_CONFIG } from "../internal/internalConstants.js";
import Config from "./BaseConfig.js";
class CloudConfig extends Config {
    /**
     * @param {ICloudConfig} userCloudConfig {@link ICloudConfig}
     *
     */
    constructor(userCloudConfig) {
        super();
        const cloudConfig = this.filterOutNonSupportedKeys(userCloudConfig, ALLOWED_CLOUD_CONFIG);
        Object.assign(this, cloudConfig);
        if (!this.cloudName) {
            throw 'Missing mandatory field cloudName';
        }
    }
    extend(userCloudConfig) {
        const cloudConfig = this.filterOutNonSupportedKeys(userCloudConfig, ALLOWED_CLOUD_CONFIG);
        return new CloudConfig(Object.assign({}, this, cloudConfig));
    }
    /**
     * @param {string} value Sets the CloudName
     */
    setCloudName(value) {
        this.cloudName = value;
        return this;
    }
    /**
     * @param {string} value Sets the API Key
     */
    setApiKey(value) {
        this.apiKey = value;
        return this;
    }
    /**
     * @param {string} value Sets the API Secret
     */
    setApiSecret(value) {
        this.apiSecret = value;
        return this;
    }
}
export default CloudConfig;
