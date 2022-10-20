"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformEnv = void 0;
const errors_1 = require("./errors");
/**
 * Helper function to support both `VERCEL_` and legacy `NOW_` env vars.
 * Throws an error if *both* env vars are defined.
 */
const getPlatformEnv = (name) => {
    const vName = `VERCEL_${name}`;
    const nName = `NOW_${name}`;
    const v = process.env[vName];
    const n = process.env[nName];
    if (typeof v === 'string') {
        if (typeof n === 'string') {
            throw new errors_1.NowBuildError({
                code: 'CONFLICTING_ENV_VAR_NAMES',
                message: `Both "${vName}" and "${nName}" env vars are defined. Please only define the "${vName}" env var.`,
                link: 'https://vercel.link/combining-old-and-new-config',
            });
        }
        return v;
    }
    return n;
};
exports.getPlatformEnv = getPlatformEnv;
