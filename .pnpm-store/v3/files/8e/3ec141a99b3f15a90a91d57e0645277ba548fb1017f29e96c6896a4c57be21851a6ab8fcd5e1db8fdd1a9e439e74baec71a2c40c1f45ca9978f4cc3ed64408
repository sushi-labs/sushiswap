"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.introspectSchema = void 0;
const graphql_1 = require("graphql");
const value_or_promise_1 = require("value-or-promise");
const utils_1 = require("@graphql-tools/utils");
function getSchemaFromIntrospection(introspectionResult, options) {
    var _a;
    if ((_a = introspectionResult === null || introspectionResult === void 0 ? void 0 : introspectionResult.data) === null || _a === void 0 ? void 0 : _a.__schema) {
        return (0, graphql_1.buildClientSchema)(introspectionResult.data, options);
    }
    throw new Error('Could not obtain introspection result, received: ' + JSON.stringify(introspectionResult));
}
function introspectSchema(executor, context, options) {
    const parsedIntrospectionQuery = (0, graphql_1.parse)((0, graphql_1.getIntrospectionQuery)(options), options);
    return new value_or_promise_1.ValueOrPromise(() => executor({
        document: parsedIntrospectionQuery,
        context,
    }))
        .then(introspection => {
        if ((0, utils_1.isAsyncIterable)(introspection)) {
            const iterator = introspection[Symbol.asyncIterator]();
            return iterator.next().then(({ value }) => value);
        }
        return introspection;
    })
        .then(introspection => getSchemaFromIntrospection(introspection, options))
        .resolve();
}
exports.introspectSchema = introspectSchema;
