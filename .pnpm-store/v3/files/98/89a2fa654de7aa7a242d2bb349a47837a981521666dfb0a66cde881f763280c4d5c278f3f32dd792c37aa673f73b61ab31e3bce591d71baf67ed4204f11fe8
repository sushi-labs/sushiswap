"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMaskedErrors = exports.formatError = exports.EnvelopError = exports.DEFAULT_ERROR_MESSAGE = void 0;
const graphql_1 = require("graphql");
const utils_js_1 = require("../utils.js");
exports.DEFAULT_ERROR_MESSAGE = 'Unexpected error.';
class EnvelopError extends graphql_1.GraphQLError {
    constructor(message, extensions) {
        super(message, undefined, undefined, undefined, undefined, undefined, extensions);
    }
}
exports.EnvelopError = EnvelopError;
const formatError = (err, message, isDev) => {
    var _a, _b, _c, _d;
    if (err instanceof graphql_1.GraphQLError) {
        if (
        /** execution error */
        (err.originalError && err.originalError instanceof EnvelopError === false) ||
            /** validate and parse errors */
            (err.originalError === undefined && err instanceof EnvelopError === false)) {
            return new graphql_1.GraphQLError(message, err.nodes, err.source, err.positions, err.path, undefined, isDev
                ? {
                    originalError: {
                        message: (_b = (_a = err.originalError) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : err.message,
                        stack: (_d = (_c = err.originalError) === null || _c === void 0 ? void 0 : _c.stack) !== null && _d !== void 0 ? _d : err.stack,
                    },
                }
                : undefined);
        }
        return err;
    }
    return new graphql_1.GraphQLError(message);
};
exports.formatError = formatError;
const makeHandleResult = (format, message, isDev) => ({ result, setResult }) => {
    if (result.errors != null) {
        setResult({ ...result, errors: result.errors.map(error => format(error, message, isDev)) });
    }
};
const useMaskedErrors = (opts) => {
    var _a, _b;
    const format = (_a = opts === null || opts === void 0 ? void 0 : opts.formatError) !== null && _a !== void 0 ? _a : exports.formatError;
    const message = (opts === null || opts === void 0 ? void 0 : opts.errorMessage) || exports.DEFAULT_ERROR_MESSAGE;
    // eslint-disable-next-line dot-notation
    const isDev = (_b = opts === null || opts === void 0 ? void 0 : opts.isDev) !== null && _b !== void 0 ? _b : (typeof process !== 'undefined' ? process.env['NODE_ENV'] === 'development' : false);
    const handleResult = makeHandleResult(format, message, isDev);
    return {
        onParse: (opts === null || opts === void 0 ? void 0 : opts.handleParseErrors) === true
            ? function onParse() {
                return function onParseEnd({ result, replaceParseResult }) {
                    if (result instanceof Error) {
                        replaceParseResult(format(result, message, isDev));
                    }
                };
            }
            : undefined,
        onValidate: (opts === null || opts === void 0 ? void 0 : opts.handleValidationErrors) === true
            ? function onValidate() {
                return function onValidateEnd({ valid, result, setResult }) {
                    if (valid === false) {
                        setResult(result.map(error => format(error, message, isDev)));
                    }
                };
            }
            : undefined,
        onPluginInit(context) {
            context.registerContextErrorHandler(({ error, setError }) => {
                if (error instanceof graphql_1.GraphQLError === false && error instanceof Error) {
                    error = new graphql_1.GraphQLError(error.message, undefined, undefined, undefined, undefined, error);
                }
                setError(format(error, message, isDev));
            });
        },
        onExecute() {
            return {
                onExecuteDone(payload) {
                    return (0, utils_js_1.handleStreamOrSingleExecutionResult)(payload, handleResult);
                },
            };
        },
        onSubscribe() {
            return {
                onSubscribeResult(payload) {
                    return (0, utils_js_1.handleStreamOrSingleExecutionResult)(payload, handleResult);
                },
                onSubscribeError({ error, setError }) {
                    setError(format(error, message, isDev));
                },
            };
        },
    };
};
exports.useMaskedErrors = useMaskedErrors;
