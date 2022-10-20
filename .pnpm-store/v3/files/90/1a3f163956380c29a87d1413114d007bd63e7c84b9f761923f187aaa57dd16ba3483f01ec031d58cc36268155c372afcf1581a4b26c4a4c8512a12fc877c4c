"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLogger = void 0;
const utils_js_1 = require("../utils.js");
const DEFAULT_OPTIONS = {
    logFn: console.log,
};
const useLogger = (rawOptions = DEFAULT_OPTIONS) => {
    const options = {
        DEFAULT_OPTIONS,
        ...rawOptions,
    };
    return {
        onParse({ extendContext, params }) {
            if (options.skipIntrospection && (0, utils_js_1.isIntrospectionOperationString)(params.source)) {
                extendContext({
                    [utils_js_1.envelopIsIntrospectionSymbol]: true,
                });
            }
        },
        onExecute({ args }) {
            if (args.contextValue[utils_js_1.envelopIsIntrospectionSymbol]) {
                return;
            }
            options.logFn('execute-start', { args });
            return {
                onExecuteDone: ({ result }) => {
                    options.logFn('execute-end', { args, result });
                },
            };
        },
        onSubscribe({ args }) {
            if (args.contextValue[utils_js_1.envelopIsIntrospectionSymbol]) {
                return;
            }
            options.logFn('subscribe-start', { args });
            return {
                onSubscribeResult: ({ result }) => {
                    options.logFn('subscribe-end', { args, result });
                },
            };
        },
    };
};
exports.useLogger = useLogger;
