"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTiming = void 0;
const graphql_1 = require("graphql");
const utils_js_1 = require("../utils.js");
const HR_TO_NS = 1e9;
const NS_TO_MS = 1e6;
const DEFAULT_OPTIONS = {
    onExecutionMeasurement: (args, timing) => console.log(`Operation execution "${args.operationName}" done in ${timing.ms}ms`),
    onSubscriptionMeasurement: (args, timing) => console.log(`Operation subscription "${args.operationName}" done in ${timing.ms}ms`),
    onParsingMeasurement: (source, timing) => console.log(`Parsing "${source}" done in ${timing.ms}ms`),
    onValidationMeasurement: (document, timing) => { var _a, _b; return console.log(`Validation "${((_b = (_a = (0, graphql_1.getOperationAST)(document)) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.value) || '-'}" done in ${timing.ms}ms`); },
    onResolverMeasurement: (info, timing) => console.log(`\tResolver of "${info.parentType.toString()}.${info.fieldName}" done in ${timing.ms}ms`),
    onContextBuildingMeasurement: (timing) => console.log(`Context building done in ${timing.ms}ms`),
};
const deltaFrom = (hrtime) => {
    const delta = process.hrtime(hrtime);
    const ns = delta[0] * HR_TO_NS + delta[1];
    return {
        ns,
        get ms() {
            return ns / NS_TO_MS;
        },
    };
};
const useTiming = (rawOptions) => {
    const options = {
        ...DEFAULT_OPTIONS,
        ...rawOptions,
    };
    const result = {};
    if (options.onContextBuildingMeasurement) {
        result.onContextBuilding = ({ context }) => {
            if (context[utils_js_1.envelopIsIntrospectionSymbol]) {
                return;
            }
            const contextStartTime = process.hrtime();
            return () => {
                options.onContextBuildingMeasurement(deltaFrom(contextStartTime));
            };
        };
    }
    if (options.onParsingMeasurement) {
        result.onParse = ({ params, extendContext }) => {
            if (options.skipIntrospection && (0, utils_js_1.isIntrospectionOperationString)(params.source)) {
                extendContext({
                    [utils_js_1.envelopIsIntrospectionSymbol]: true,
                });
                return;
            }
            const parseStartTime = process.hrtime();
            return () => {
                options.onParsingMeasurement(params.source, deltaFrom(parseStartTime));
            };
        };
    }
    if (options.onValidationMeasurement) {
        result.onValidate = ({ params, context }) => {
            if (context[utils_js_1.envelopIsIntrospectionSymbol]) {
                return;
            }
            const validateStartTime = process.hrtime();
            return () => {
                options.onValidationMeasurement(params.documentAST, deltaFrom(validateStartTime));
            };
        };
    }
    if (options.onExecutionMeasurement) {
        if (options.onResolverMeasurement) {
            result.onExecute = ({ args }) => {
                if (args.contextValue[utils_js_1.envelopIsIntrospectionSymbol]) {
                    return;
                }
                const executeStartTime = process.hrtime();
                return {
                    onExecuteDone: () => {
                        options.onExecutionMeasurement(args, deltaFrom(executeStartTime));
                    },
                };
            };
            result.onResolverCalled = ({ info }) => {
                const resolverStartTime = process.hrtime();
                return () => {
                    options.onResolverMeasurement(info, deltaFrom(resolverStartTime));
                };
            };
        }
        else {
            result.onExecute = ({ args }) => {
                if (args.contextValue[utils_js_1.envelopIsIntrospectionSymbol]) {
                    return;
                }
                const executeStartTime = process.hrtime();
                return {
                    onExecuteDone: () => {
                        options.onExecutionMeasurement(args, deltaFrom(executeStartTime));
                    },
                };
            };
        }
    }
    if (options.onSubscriptionMeasurement) {
        if (options.onResolverMeasurement) {
            result.onSubscribe = ({ args }) => {
                if (args.contextValue[utils_js_1.envelopIsIntrospectionSymbol]) {
                    return;
                }
                const subscribeStartTime = process.hrtime();
                return {
                    onSubscribeResult: () => {
                        options.onSubscriptionMeasurement && options.onSubscriptionMeasurement(args, deltaFrom(subscribeStartTime));
                    },
                };
            };
            result.onResolverCalled = ({ info }) => {
                const resolverStartTime = process.hrtime();
                return () => {
                    options.onResolverMeasurement && options.onResolverMeasurement(info, deltaFrom(resolverStartTime));
                };
            };
        }
        else {
            result.onSubscribe = ({ args }) => {
                if (args.contextValue[utils_js_1.envelopIsIntrospectionSymbol]) {
                    return;
                }
                const subscribeStartTime = process.hrtime();
                return {
                    onSubscribeResult: () => {
                        options.onSubscriptionMeasurement && options.onSubscriptionMeasurement(args, deltaFrom(subscribeStartTime));
                    },
                };
            };
        }
    }
    return result;
};
exports.useTiming = useTiming;
