"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entrypointToOutputPath = exports.getRegExpFromMatchers = void 0;
const path_1 = require("path");
const path_to_regexp_1 = require("path-to-regexp");
function getRegExpFromMatchers(matcherOrMatchers) {
    if (!matcherOrMatchers) {
        return '^/.*$';
    }
    const matchers = Array.isArray(matcherOrMatchers)
        ? matcherOrMatchers
        : [matcherOrMatchers];
    return matchers.map(getRegExpFromMatcher).join('|');
}
exports.getRegExpFromMatchers = getRegExpFromMatchers;
function getRegExpFromMatcher(matcher) {
    if (typeof matcher !== 'string') {
        throw new Error('`matcher` must be a path matcher or an array of path matchers');
    }
    if (!matcher.startsWith('/')) {
        throw new Error('`matcher`: path matcher must start with /');
    }
    const re = path_to_regexp_1.pathToRegexp(matcher);
    return re.source;
}
/**
 * If `zeroConfig`:
 *   "api/foo.js" -> "api/foo.js"
 *   "api/foo.ts" -> "api/foo.ts"
 *
 * If *NOT* `zeroConfig`:
 *   "api/foo.js" -> "api/foo"
 *   "api/foo.ts" -> "api/foo"
 */
function entrypointToOutputPath(entrypoint, zeroConfig) {
    if (zeroConfig) {
        const ext = path_1.extname(entrypoint);
        return entrypoint.slice(0, entrypoint.length - ext.length);
    }
    return entrypoint;
}
exports.entrypointToOutputPath = entrypointToOutputPath;
