"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidationCache = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const lru_cache_1 = tslib_1.__importDefault(require("lru-cache"));
const DEFAULT_MAX = 1000;
const DEFAULT_TTL = 3600000;
const rawDocumentSymbol = Symbol('rawDocument');
const useValidationCache = (pluginOptions = {}) => {
    const resultCache = typeof pluginOptions.cache !== 'undefined'
        ? pluginOptions.cache
        : new lru_cache_1.default({
            max: DEFAULT_MAX,
            maxAge: DEFAULT_TTL,
        });
    return {
        onSchemaChange() {
            var _a, _b;
            if (resultCache.reset) {
                (_a = resultCache.reset) === null || _a === void 0 ? void 0 : _a.call(resultCache);
            }
            else if ('clear' in resultCache) {
                (_b = resultCache.clear) === null || _b === void 0 ? void 0 : _b.call(resultCache);
            }
        },
        onParse({ params, extendContext }) {
            extendContext({ [rawDocumentSymbol]: params.source.toString() });
        },
        onValidate({ params, context, setResult }) {
            var _a;
            const key = (_a = context[rawDocumentSymbol]) !== null && _a !== void 0 ? _a : (0, graphql_1.print)(params.documentAST);
            const cachedResult = resultCache.get(key);
            if (cachedResult !== undefined) {
                setResult(cachedResult);
            }
            return ({ result }) => {
                resultCache.set(key, result);
            };
        },
    };
};
exports.useValidationCache = useValidationCache;
