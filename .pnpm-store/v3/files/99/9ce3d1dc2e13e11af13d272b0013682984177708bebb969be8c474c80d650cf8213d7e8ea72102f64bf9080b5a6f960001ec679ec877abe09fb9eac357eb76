import type { IConfig, IRobotPolicy } from '../interface.js';
export declare class RobotsTxtBuilder {
    /**
     * Normalize robots.txt policies
     * @param policies
     * @returns
     */
    normalizePolicy(policies: IRobotPolicy[]): IRobotPolicy[];
    /**
     * Add new policy
     * @param key
     * @param rules
     * @returns
     */
    addPolicies(key: string, rules: string[]): string;
    /**
     * Generates robots.txt content
     * @param config
     * @returns
     */
    generateRobotsTxt(config: IConfig): string;
}
