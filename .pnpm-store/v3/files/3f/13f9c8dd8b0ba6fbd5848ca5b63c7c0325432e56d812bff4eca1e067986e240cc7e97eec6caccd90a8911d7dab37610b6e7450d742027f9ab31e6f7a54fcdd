'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const graphql = require('graphql');

const GraphQLLiveDirective = new graphql.GraphQLDirective({
    name: "live",
    description: "Instruction for establishing a live connection that is updated once the underlying data changes.",
    locations: [graphql.DirectiveLocation.QUERY],
    args: {
        if: {
            type: graphql.GraphQLBoolean,
            defaultValue: true,
            description: "Whether the query should be live or not.",
        },
        throttle: {
            type: graphql.GraphQLInt,
            description: 'Propose a desired throttle interval ot the server in order to receive updates to at most once per "throttle" milliseconds. The server must not accept this value.',
        },
    },
});

const isNone = (input) => input == null;

const getLiveDirectiveNode = (input) => {
    var _a;
    if (input.kind !== "OperationDefinition" || input.operation !== "query") {
        return null;
    }
    const liveDirective = (_a = input.directives) === null || _a === void 0 ? void 0 : _a.find((d) => d.name.value === "live");
    if (isNone(liveDirective)) {
        return null;
    }
    return liveDirective;
};

const NoLiveMixedWithDeferStreamRule = (context) => {
    return {
        OperationDefinition(operationDefinitionNode) {
            if (isNone(getLiveDirectiveNode(operationDefinitionNode))) {
                return false;
            }
        },
        Directive(directiveNode) {
            if (directiveNode.name.value === "defer" ||
                directiveNode.name.value === "stream") {
                context.reportError(new graphql.GraphQLError(`Cannot mix "@${directiveNode.name.value}" with "@live".`, directiveNode.name));
            }
        },
    };
};

const getLiveDirectiveArgumentValues = (node, variableValues) => {
    var _a;
    const values = graphql.getDirectiveValues(GraphQLLiveDirective, { directives: [node] }, variableValues);
    return {
        isLive: (values === null || values === void 0 ? void 0 : values["if"]) === true,
        throttleValue: ((_a = values === null || values === void 0 ? void 0 : values["throttle"]) !== null && _a !== void 0 ? _a : null),
    };
};

const isLiveQueryOperationDefinitionNode = (input, variables) => {
    const liveDirectiveNode = getLiveDirectiveNode(input);
    if (isNone(liveDirectiveNode)) {
        return false;
    }
    return getLiveDirectiveArgumentValues(liveDirectiveNode, variables).isLive;
};

exports.GraphQLLiveDirective = GraphQLLiveDirective;
exports.NoLiveMixedWithDeferStreamRule = NoLiveMixedWithDeferStreamRule;
exports.getLiveDirectiveArgumentValues = getLiveDirectiveArgumentValues;
exports.getLiveDirectiveNode = getLiveDirectiveNode;
exports.isLiveQueryOperationDefinitionNode = isLiveQueryOperationDefinitionNode;
