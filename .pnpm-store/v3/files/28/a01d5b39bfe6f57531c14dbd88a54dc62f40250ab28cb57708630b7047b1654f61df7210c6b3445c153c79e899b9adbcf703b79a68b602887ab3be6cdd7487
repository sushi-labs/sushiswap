import ICloudConfig from "./interfaces/Config/ICloudConfig.js";
import Config from "./BaseConfig.js";
declare class CloudConfig extends Config implements ICloudConfig {
    cloudName?: string;
    apiKey?: string;
    apiSecret?: string;
    /**
     * @param {ICloudConfig} userCloudConfig {@link ICloudConfig}
     *
     */
    constructor(userCloudConfig: ICloudConfig);
    extend(userCloudConfig: ICloudConfig): CloudConfig;
    /**
     * @param {string} value Sets the CloudName
     */
    setCloudName(value: string): this;
    /**
     * @param {string} value Sets the API Key
     */
    setApiKey(value: string): this;
    /**
     * @param {string} value Sets the API Secret
     */
    setApiSecret(value: string): this;
}
export default CloudConfig;
