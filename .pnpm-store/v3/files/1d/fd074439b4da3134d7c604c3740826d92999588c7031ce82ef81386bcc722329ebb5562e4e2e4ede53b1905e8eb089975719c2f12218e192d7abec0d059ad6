"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useParserCache = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const lru_cache_1 = tslib_1.__importDefault(require("lru-cache"));
const DEFAULT_MAX = 1000;
const DEFAULT_TTL = 3600000;
const useParserCache = (pluginOptions = {}) => {
    const documentCache = typeof pluginOptions.documentCache !== 'undefined'
        ? pluginOptions.documentCache
        : new lru_cache_1.default({ max: DEFAULT_MAX, maxAge: DEFAULT_TTL });
    const errorCache = typeof pluginOptions.errorCache !== 'undefined'
        ? pluginOptions.errorCache
        : new lru_cache_1.default({ max: DEFAULT_MAX, maxAge: DEFAULT_TTL });
    return {
        onParse({ params, setParsedDocument }) {
            const { source } = params;
            const key = source instanceof graphql_1.Source ? source.body : source;
            const cachedError = errorCache.get(key);
            if (cachedError !== undefined) {
                throw cachedError;
            }
            const cachedDocument = documentCache.get(key);
            if (cachedDocument !== undefined) {
                setParsedDocument(cachedDocument);
            }
            return ({ result }) => {
                if (result instanceof Error) {
                    errorCache.set(key, result);
                }
                else if (result !== null) {
                    documentCache.set(key, result);
                }
            };
        },
    };
};
exports.useParserCache = useParserCache;
