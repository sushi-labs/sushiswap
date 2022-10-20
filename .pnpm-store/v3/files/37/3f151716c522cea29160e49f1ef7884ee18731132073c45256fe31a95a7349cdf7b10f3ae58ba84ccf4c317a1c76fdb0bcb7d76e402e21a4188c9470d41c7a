import type { IConfig, IRuntimePaths } from '../interface.js';
export declare class ConfigParser {
    /**
     * Get runtime config
     * @param runtimePaths
     * @returns
     */
    getRuntimeConfig(runtimePaths: IRuntimePaths): Promise<Partial<IConfig>>;
    /**
     * Update existing config with runtime config
     * @param config
     * @param runtimePaths
     * @returns
     */
    withRuntimeConfig(config: IConfig, runtimePaths: IRuntimePaths): Promise<IConfig>;
    /**
     * Load next-sitemap.config.js as module
     * @returns
     */
    loadBaseConfig(): Promise<IConfig>;
}
