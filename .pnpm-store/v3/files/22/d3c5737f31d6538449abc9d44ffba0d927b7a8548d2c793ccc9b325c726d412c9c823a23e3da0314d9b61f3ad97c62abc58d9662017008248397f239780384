"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareTracedSchema = exports.resolversHooksSymbol = exports.trackedSchemaSymbol = void 0;
const graphql_1 = require("graphql");
exports.trackedSchemaSymbol = Symbol('TRACKED_SCHEMA');
exports.resolversHooksSymbol = Symbol('RESOLVERS_HOOKS');
function prepareTracedSchema(schema) {
    if (!schema || schema[exports.trackedSchemaSymbol]) {
        return;
    }
    schema[exports.trackedSchemaSymbol] = true;
    const entries = Object.values(schema.getTypeMap());
    for (const type of entries) {
        if (!(0, graphql_1.isIntrospectionType)(type) && (0, graphql_1.isObjectType)(type)) {
            const fields = Object.values(type.getFields());
            for (const field of fields) {
                let resolverFn = (field.resolve || graphql_1.defaultFieldResolver);
                field.resolve = async (root, args, context, info) => {
                    if (context && context[exports.resolversHooksSymbol]) {
                        const hooks = context[exports.resolversHooksSymbol];
                        const afterCalls = [];
                        for (const hook of hooks) {
                            const afterFn = await hook({
                                root,
                                args,
                                context,
                                info,
                                resolverFn,
                                replaceResolverFn: newFn => {
                                    resolverFn = newFn;
                                },
                            });
                            afterFn && afterCalls.push(afterFn);
                        }
                        try {
                            let result = await resolverFn(root, args, context, info);
                            for (const afterFn of afterCalls) {
                                afterFn({
                                    result,
                                    setResult: newResult => {
                                        result = newResult;
                                    },
                                });
                            }
                            return result;
                        }
                        catch (e) {
                            let resultErr = e;
                            for (const afterFn of afterCalls) {
                                afterFn({
                                    result: resultErr,
                                    setResult: newResult => {
                                        resultErr = newResult;
                                    },
                                });
                            }
                            throw resultErr;
                        }
                    }
                    else {
                        return resolverFn(root, args, context, info);
                    }
                };
            }
        }
    }
}
exports.prepareTracedSchema = prepareTracedSchema;
