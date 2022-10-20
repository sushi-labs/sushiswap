import { YogaLogger } from '../logger.js';
import { Plugin } from './types.js';
export interface HealthCheckPluginOptions {
    id?: string;
    logger?: YogaLogger;
    healthCheckEndpoint?: string;
    readinessCheckEndpoint?: string;
}
export declare function useHealthCheck({ id, logger, healthCheckEndpoint, readinessCheckEndpoint, }?: HealthCheckPluginOptions): Plugin;
