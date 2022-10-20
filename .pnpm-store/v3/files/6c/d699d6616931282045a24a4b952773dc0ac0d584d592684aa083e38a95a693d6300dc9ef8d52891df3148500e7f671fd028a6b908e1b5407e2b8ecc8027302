import { isAsyncIterable } from '@envelop/core';
import { GraphQLError, Kind, visit } from 'graphql';
import { Repeater } from '@repeaterjs/repeater';
import { mergeSchemas } from '@graphql-tools/schema';
export default function usePollingLive({ config: { defaultInterval = 1000 } = {} } = {}) {
    return {
        onSchemaChange({ schema, replaceSchema }) {
            if (!schema.getDirective('live')) {
                replaceSchema(mergeSchemas({
                    schemas: [schema],
                    typeDefs: /* GraphQL */ `
              directive @live(interval: Int) on QUERY
            `,
                }));
            }
        },
        onExecute({ args, executeFn, setExecuteFn }) {
            var _a, _b;
            let liveDirectiveNode;
            args.document = visit(args.document, {
                OperationDefinition(node) {
                    var _a;
                    if (args.operationName != null && ((_a = node.name) === null || _a === void 0 ? void 0 : _a.value) !== args.operationName) {
                        return;
                    }
                    const directives = [];
                    if (node.directives && node.operation === 'query') {
                        for (const directive of node.directives) {
                            if (directive.name.value === 'live') {
                                liveDirectiveNode = directive;
                            }
                            else {
                                directives.push(directive);
                            }
                        }
                        return {
                            ...node,
                            directives,
                        };
                    }
                    return node;
                },
            });
            if (liveDirectiveNode) {
                const intervalArgNode = (_a = liveDirectiveNode.arguments) === null || _a === void 0 ? void 0 : _a.find((argNode) => argNode.name.value === 'interval');
                let intervalMs = defaultInterval;
                if (((_b = intervalArgNode === null || intervalArgNode === void 0 ? void 0 : intervalArgNode.value) === null || _b === void 0 ? void 0 : _b.kind) === Kind.INT) {
                    intervalMs = parseInt(intervalArgNode.value.value);
                }
                setExecuteFn((args) => new Repeater((push, stop) => {
                    let finished = false;
                    async function pump() {
                        if (finished) {
                            return;
                        }
                        const result = await executeFn(args);
                        if (isAsyncIterable(result)) {
                            push({
                                data: null,
                                errors: [new GraphQLError('Execution returned AsyncIterable which is not supported!')],
                                isLive: true,
                            });
                            stop();
                            return;
                        }
                        result.isLive = true;
                        if (finished) {
                            return;
                        }
                        push(result);
                        setTimeout(pump, intervalMs);
                    }
                    pump();
                    stop.then(() => {
                        finished = true;
                    });
                }));
            }
        },
    };
}
