import { getIntrospectionQuery, buildClientSchema, parse, } from 'graphql';
import { ValueOrPromise } from 'value-or-promise';
import { isAsyncIterable } from '@graphql-tools/utils';
function getSchemaFromIntrospection(introspectionResult, options) {
    var _a;
    if ((_a = introspectionResult === null || introspectionResult === void 0 ? void 0 : introspectionResult.data) === null || _a === void 0 ? void 0 : _a.__schema) {
        return buildClientSchema(introspectionResult.data, options);
    }
    throw new Error('Could not obtain introspection result, received: ' + JSON.stringify(introspectionResult));
}
export function introspectSchema(executor, context, options) {
    const parsedIntrospectionQuery = parse(getIntrospectionQuery(options), options);
    return new ValueOrPromise(() => executor({
        document: parsedIntrospectionQuery,
        context,
    }))
        .then(introspection => {
        if (isAsyncIterable(introspection)) {
            const iterator = introspection[Symbol.asyncIterator]();
            return iterator.next().then(({ value }) => value);
        }
        return introspection;
    })
        .then(introspection => getSchemaFromIntrospection(introspection, options))
        .resolve();
}
