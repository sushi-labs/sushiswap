"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorAsyncIterator = exports.finalAsyncIterator = exports.handleStreamOrSingleExecutionResult = exports.isAsyncIterable = exports.makeExecute = exports.mapAsyncIterator = exports.makeSubscribe = exports.isIntrospectionOperationString = exports.isIntrospectionDocument = exports.isIntrospectionOperation = exports.isOperationDefinition = exports.envelopIsIntrospectionSymbol = void 0;
const graphql_1 = require("graphql");
exports.envelopIsIntrospectionSymbol = Symbol('ENVELOP_IS_INTROSPECTION');
function isOperationDefinition(def) {
    return def.kind === graphql_1.Kind.OPERATION_DEFINITION;
}
exports.isOperationDefinition = isOperationDefinition;
function isIntrospectionOperation(operation) {
    return isIntrospectionDocument({
        kind: graphql_1.Kind.DOCUMENT,
        definitions: [operation],
    });
}
exports.isIntrospectionOperation = isIntrospectionOperation;
function isIntrospectionDocument(document) {
    let isIntrospectionOperation = false;
    (0, graphql_1.visit)(document, {
        Field: node => {
            if (node.name.value === '__schema' || node.name.value === '__type') {
                isIntrospectionOperation = true;
                return graphql_1.BREAK;
            }
        },
    });
    return isIntrospectionOperation;
}
exports.isIntrospectionDocument = isIntrospectionDocument;
function isIntrospectionOperationString(operation) {
    return (typeof operation === 'string' ? operation : operation.body).indexOf('__schema') !== -1;
}
exports.isIntrospectionOperationString = isIntrospectionOperationString;
function getSubscribeArgs(args) {
    return args.length === 1
        ? args[0]
        : {
            schema: args[0],
            document: args[1],
            rootValue: args[2],
            contextValue: args[3],
            variableValues: args[4],
            operationName: args[5],
            fieldResolver: args[6],
            subscribeFieldResolver: args[7],
        };
}
/**
 * Utility function for making a subscribe function that handles polymorphic arguments.
 */
const makeSubscribe = (subscribeFn) => ((...polyArgs) => subscribeFn(getSubscribeArgs(polyArgs)));
exports.makeSubscribe = makeSubscribe;
function mapAsyncIterator(source, mapper) {
    const iterator = source[Symbol.asyncIterator]();
    async function mapResult(result) {
        var _a;
        if (result.done) {
            return result;
        }
        try {
            return { value: await mapper(result.value), done: false };
        }
        catch (error) {
            try {
                await ((_a = iterator.return) === null || _a === void 0 ? void 0 : _a.call(iterator));
            }
            catch (_error) {
                /* ignore error */
            }
            throw error;
        }
    }
    const stream = {
        [Symbol.asyncIterator]() {
            return stream;
        },
        async next() {
            return await mapResult(await iterator.next());
        },
        async return() {
            var _a;
            const promise = (_a = iterator.return) === null || _a === void 0 ? void 0 : _a.call(iterator);
            return promise ? await mapResult(await promise) : { value: undefined, done: true };
        },
        async throw(error) {
            var _a;
            const promise = (_a = iterator.throw) === null || _a === void 0 ? void 0 : _a.call(iterator);
            if (promise) {
                return await mapResult(await promise);
            }
            // if the source has no throw method we just re-throw error
            // usually throw is not called anyways
            throw error;
        },
    };
    return stream;
}
exports.mapAsyncIterator = mapAsyncIterator;
function getExecuteArgs(args) {
    return args.length === 1
        ? args[0]
        : {
            schema: args[0],
            document: args[1],
            rootValue: args[2],
            contextValue: args[3],
            variableValues: args[4],
            operationName: args[5],
            fieldResolver: args[6],
            typeResolver: args[7],
        };
}
/**
 * Utility function for making a execute function that handles polymorphic arguments.
 */
const makeExecute = (executeFn) => ((...polyArgs) => executeFn(getExecuteArgs(polyArgs)));
exports.makeExecute = makeExecute;
/**
 * Returns true if the provided object implements the AsyncIterator protocol via
 * implementing a `Symbol.asyncIterator` method.
 *
 * Source: https://github.com/graphql/graphql-js/blob/main/src/jsutils/isAsyncIterable.ts
 */
function isAsyncIterable(maybeAsyncIterable) {
    return (typeof maybeAsyncIterable === 'object' &&
        maybeAsyncIterable != null &&
        typeof maybeAsyncIterable[Symbol.asyncIterator] === 'function');
}
exports.isAsyncIterable = isAsyncIterable;
/**
 * A utility function for handling `onExecuteDone` hook result, for simplifying the handling of AsyncIterable returned from `execute`.
 *
 * @param payload The payload send to `onExecuteDone` hook function
 * @param fn The handler to be executed on each result
 * @returns a subscription for streamed results, or undefined in case of an non-async
 */
function handleStreamOrSingleExecutionResult(payload, fn) {
    if (isAsyncIterable(payload.result)) {
        return { onNext: fn };
    }
    fn({
        args: payload.args,
        result: payload.result,
        setResult: payload.setResult,
    });
    return undefined;
}
exports.handleStreamOrSingleExecutionResult = handleStreamOrSingleExecutionResult;
function finalAsyncIterator(source, onFinal) {
    const iterator = source[Symbol.asyncIterator]();
    let isDone = false;
    const stream = {
        [Symbol.asyncIterator]() {
            return stream;
        },
        async next() {
            const result = await iterator.next();
            if (result.done && isDone === false) {
                isDone = true;
                onFinal();
            }
            return result;
        },
        async return() {
            var _a;
            const promise = (_a = iterator.return) === null || _a === void 0 ? void 0 : _a.call(iterator);
            if (isDone === false) {
                isDone = true;
                onFinal();
            }
            return promise ? await promise : { done: true, value: undefined };
        },
        async throw(error) {
            var _a;
            const promise = (_a = iterator.throw) === null || _a === void 0 ? void 0 : _a.call(iterator);
            if (promise) {
                return await promise;
            }
            // if the source has no throw method we just re-throw error
            // usually throw is not called anyways
            throw error;
        },
    };
    return stream;
}
exports.finalAsyncIterator = finalAsyncIterator;
function errorAsyncIterator(source, onError) {
    const iterator = source[Symbol.asyncIterator]();
    const stream = {
        [Symbol.asyncIterator]() {
            return stream;
        },
        async next() {
            try {
                return await iterator.next();
            }
            catch (error) {
                onError(error);
                return { done: true, value: undefined };
            }
        },
        async return() {
            var _a;
            const promise = (_a = iterator.return) === null || _a === void 0 ? void 0 : _a.call(iterator);
            return promise ? await promise : { done: true, value: undefined };
        },
        async throw(error) {
            var _a;
            const promise = (_a = iterator.throw) === null || _a === void 0 ? void 0 : _a.call(iterator);
            if (promise) {
                return await promise;
            }
            // if the source has no throw method we just re-throw error
            // usually throw is not called anyways
            throw error;
        },
    };
    return stream;
}
exports.errorAsyncIterator = errorAsyncIterator;
