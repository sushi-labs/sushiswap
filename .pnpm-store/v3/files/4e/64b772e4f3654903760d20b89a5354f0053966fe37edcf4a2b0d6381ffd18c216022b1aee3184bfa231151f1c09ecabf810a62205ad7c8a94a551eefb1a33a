import { defaultFieldResolver, isIntrospectionType, isObjectType } from 'graphql';
export const trackedSchemaSymbol = Symbol('TRACKED_SCHEMA');
export const resolversHooksSymbol = Symbol('RESOLVERS_HOOKS');
export function prepareTracedSchema(schema) {
    if (!schema || schema[trackedSchemaSymbol]) {
        return;
    }
    schema[trackedSchemaSymbol] = true;
    const entries = Object.values(schema.getTypeMap());
    for (const type of entries) {
        if (!isIntrospectionType(type) && isObjectType(type)) {
            const fields = Object.values(type.getFields());
            for (const field of fields) {
                let resolverFn = (field.resolve || defaultFieldResolver);
                field.resolve = async (root, args, context, info) => {
                    if (context && context[resolversHooksSymbol]) {
                        const hooks = context[resolversHooksSymbol];
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
