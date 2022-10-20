"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@envelop/core");
const graphql_1 = require("graphql");
const repeater_1 = require("@repeaterjs/repeater");
const schema_1 = require("@graphql-tools/schema");
function usePollingLive({ config: { defaultInterval = 1000 } = {} } = {}) {
    return {
        onSchemaChange({ schema, replaceSchema }) {
            if (!schema.getDirective('live')) {
                replaceSchema((0, schema_1.mergeSchemas)({
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
            args.document = (0, graphql_1.visit)(args.document, {
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
                if (((_b = intervalArgNode === null || intervalArgNode === void 0 ? void 0 : intervalArgNode.value) === null || _b === void 0 ? void 0 : _b.kind) === graphql_1.Kind.INT) {
                    intervalMs = parseInt(intervalArgNode.value.value);
                }
                setExecuteFn((args) => new repeater_1.Repeater((push, stop) => {
                    let finished = false;
                    async function pump() {
                        if (finished) {
                            return;
                        }
                        const result = await executeFn(args);
                        if ((0, core_1.isAsyncIterable)(result)) {
                            push({
                                data: null,
                                errors: [new graphql_1.GraphQLError('Execution returned AsyncIterable which is not supported!')],
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
exports.default = usePollingLive;
