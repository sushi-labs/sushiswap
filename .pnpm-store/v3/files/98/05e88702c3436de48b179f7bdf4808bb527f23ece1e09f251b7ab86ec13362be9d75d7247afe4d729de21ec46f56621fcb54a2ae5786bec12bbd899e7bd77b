import { YogaLogger } from '../logger.cjs';
import { Plugin } from './types.cjs';
export interface HealthCheckPluginOptions {
    id?: string;
    logger?: YogaLogger;
    healthCheckEndpoint?: string;
    readinessCheckEndpoint?: string;
}
export declare function useHealthCheck({ id, logger, healthCheckEndpoint, readinessCheckEndpoint, }?: HealthCheckPluginOptions): Plugin;
