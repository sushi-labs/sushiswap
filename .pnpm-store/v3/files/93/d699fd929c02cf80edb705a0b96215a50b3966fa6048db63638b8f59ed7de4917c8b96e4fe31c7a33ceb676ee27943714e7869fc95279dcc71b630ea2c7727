"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.traceOrchestrator = void 0;
const graphql_1 = require("graphql");
const utils_js_1 = require("./utils.js");
const getTimestamp = typeof globalThis !== 'undefined' && ((_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.performance) === null || _a === void 0 ? void 0 : _a.now)
    ? () => globalThis.performance.now()
    : () => Date.now();
const measure = () => {
    const start = getTimestamp();
    return () => {
        const end = getTimestamp();
        return end - start;
    };
};
const tracingSymbol = Symbol('envelopTracing');
function traceOrchestrator(orchestrator) {
    const createTracer = (name, ctx) => {
        const end = measure();
        return () => {
            ctx[tracingSymbol][name] = end();
        };
    };
    return {
        ...orchestrator,
        init: (ctx = {}) => {
            ctx[tracingSymbol] = ctx[tracingSymbol] || {};
            const done = createTracer('init', ctx || {});
            try {
                return orchestrator.init(ctx);
            }
            finally {
                done();
            }
        },
        parse: (ctx = {}) => {
            ctx[tracingSymbol] = ctx[tracingSymbol] || {};
            const actualFn = orchestrator.parse(ctx);
            return (...args) => {
                const done = createTracer('parse', ctx);
                try {
                    return actualFn(...args);
                }
                finally {
                    done();
                }
            };
        },
        validate: (ctx = {}) => {
            ctx[tracingSymbol] = ctx[tracingSymbol] || {};
            const actualFn = orchestrator.validate(ctx);
            return (...args) => {
                const done = createTracer('validate', ctx);
                try {
                    return actualFn(...args);
                }
                finally {
                    done();
                }
            };
        },
        execute: async (argsOrSchema, document, rootValue, contextValue, variableValues, operationName, fieldResolver, typeResolver) => {
            const args = argsOrSchema instanceof graphql_1.GraphQLSchema
                ? {
                    schema: argsOrSchema,
                    document: document,
                    rootValue,
                    contextValue,
                    variableValues,
                    operationName,
                    fieldResolver,
                    typeResolver,
                }
                : argsOrSchema;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore GraphQL.js types contextValue as unknown
            const done = createTracer('execute', args.contextValue || {});
            try {
                const result = await orchestrator.execute(args);
                done();
                if (!(0, utils_js_1.isAsyncIterable)(result)) {
                    result.extensions = result.extensions || {};
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore GraphQL.js types contextValue as unknown
                    result.extensions.envelopTracing = args.contextValue[tracingSymbol];
                }
                else {
                    // eslint-disable-next-line no-console
                    console.warn(`"traceOrchestrator" encountered a AsyncIterator which is not supported yet, so tracing data is not available for the operation.`);
                }
                return result;
            }
            catch (e) {
                done();
                throw e;
            }
        },
        subscribe: async (argsOrSchema, document, rootValue, contextValue, variableValues, operationName, fieldResolver, subscribeFieldResolver) => {
            const args = argsOrSchema instanceof graphql_1.GraphQLSchema
                ? {
                    schema: argsOrSchema,
                    document: document,
                    rootValue,
                    contextValue,
                    variableValues,
                    operationName,
                    fieldResolver,
                    subscribeFieldResolver,
                }
                : argsOrSchema;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore GraphQL.js types contextValue as unknown
            const done = createTracer('subscribe', args.contextValue || {});
            try {
                return await orchestrator.subscribe(args);
            }
            finally {
                done();
            }
        },
        contextFactory: (ctx = {}) => {
            const actualFn = orchestrator.contextFactory(ctx);
            return async (childCtx) => {
                const done = createTracer('contextFactory', ctx);
                try {
                    return await actualFn(childCtx);
                }
                finally {
                    done();
                }
            };
        },
    };
}
exports.traceOrchestrator = traceOrchestrator;
