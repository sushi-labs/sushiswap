import { Kind, visit, BREAK, } from 'graphql';
export const envelopIsIntrospectionSymbol = Symbol('ENVELOP_IS_INTROSPECTION');
export function isOperationDefinition(def) {
    return def.kind === Kind.OPERATION_DEFINITION;
}
export function isIntrospectionOperation(operation) {
    return isIntrospectionDocument({
        kind: Kind.DOCUMENT,
        definitions: [operation],
    });
}
export function isIntrospectionDocument(document) {
    let isIntrospectionOperation = false;
    visit(document, {
        Field: node => {
            if (node.name.value === '__schema' || node.name.value === '__type') {
                isIntrospectionOperation = true;
                return BREAK;
            }
        },
    });
    return isIntrospectionOperation;
}
export function isIntrospectionOperationString(operation) {
    return (typeof operation === 'string' ? operation : operation.body).indexOf('__schema') !== -1;
}
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
export const makeSubscribe = (subscribeFn) => ((...polyArgs) => subscribeFn(getSubscribeArgs(polyArgs)));
export function mapAsyncIterator(source, mapper) {
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
export const makeExecute = (executeFn) => ((...polyArgs) => executeFn(getExecuteArgs(polyArgs)));
/**
 * Returns true if the provided object implements the AsyncIterator protocol via
 * implementing a `Symbol.asyncIterator` method.
 *
 * Source: https://github.com/graphql/graphql-js/blob/main/src/jsutils/isAsyncIterable.ts
 */
export function isAsyncIterable(maybeAsyncIterable) {
    return (typeof maybeAsyncIterable === 'object' &&
        maybeAsyncIterable != null &&
        typeof maybeAsyncIterable[Symbol.asyncIterator] === 'function');
}
/**
 * A utility function for handling `onExecuteDone` hook result, for simplifying the handling of AsyncIterable returned from `execute`.
 *
 * @param payload The payload send to `onExecuteDone` hook function
 * @param fn The handler to be executed on each result
 * @returns a subscription for streamed results, or undefined in case of an non-async
 */
export function handleStreamOrSingleExecutionResult(payload, fn) {
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
export function finalAsyncIterator(source, onFinal) {
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
export function errorAsyncIterator(source, onError) {
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
