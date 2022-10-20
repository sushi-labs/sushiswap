"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const backcompatOptions = { commentDescriptions: true };
exports.default = typeFromAST;
function typeFromAST(node) {
    switch (node.kind) {
        case graphql_1.Kind.OBJECT_TYPE_DEFINITION:
            return makeObjectType(node);
        case graphql_1.Kind.INTERFACE_TYPE_DEFINITION:
            return makeInterfaceType(node);
        case graphql_1.Kind.ENUM_TYPE_DEFINITION:
            return makeEnumType(node);
        case graphql_1.Kind.UNION_TYPE_DEFINITION:
            return makeUnionType(node);
        case graphql_1.Kind.SCALAR_TYPE_DEFINITION:
            return makeScalarType(node);
        case graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION:
            return makeInputObjectType(node);
        case graphql_1.Kind.DIRECTIVE_DEFINITION:
            return makeDirective(node);
        default:
            return null;
    }
}
function makeObjectType(node) {
    const config = {
        name: node.name.value,
        description: (0, utils_1.getDescription)(node, backcompatOptions),
        interfaces: () => { var _a; return ((_a = node.interfaces) === null || _a === void 0 ? void 0 : _a.map(iface => (0, utils_1.createNamedStub)(iface.name.value, 'interface'))) || []; },
        fields: () => (node.fields != null ? makeFields(node.fields) : {}),
        astNode: node,
    };
    return new graphql_1.GraphQLObjectType(config);
}
function makeInterfaceType(node) {
    const config = {
        name: node.name.value,
        description: (0, utils_1.getDescription)(node, backcompatOptions),
        interfaces: () => {
            var _a;
            return (_a = node.interfaces) === null || _a === void 0 ? void 0 : _a.map(iface => (0, utils_1.createNamedStub)(iface.name.value, 'interface'));
        },
        fields: () => (node.fields != null ? makeFields(node.fields) : {}),
        astNode: node,
    };
    return new graphql_1.GraphQLInterfaceType(config);
}
function makeEnumType(node) {
    var _a, _b;
    const values = (_b = (_a = node.values) === null || _a === void 0 ? void 0 : _a.reduce((prev, value) => ({
        ...prev,
        [value.name.value]: {
            description: (0, utils_1.getDescription)(value, backcompatOptions),
            deprecationReason: getDeprecationReason(value),
            astNode: value,
        },
    }), {})) !== null && _b !== void 0 ? _b : {};
    return new graphql_1.GraphQLEnumType({
        name: node.name.value,
        description: (0, utils_1.getDescription)(node, backcompatOptions),
        values,
        astNode: node,
    });
}
function makeUnionType(node) {
    return new graphql_1.GraphQLUnionType({
        name: node.name.value,
        description: (0, utils_1.getDescription)(node, backcompatOptions),
        types: () => { var _a, _b; return (_b = (_a = node.types) === null || _a === void 0 ? void 0 : _a.map(type => (0, utils_1.createNamedStub)(type.name.value, 'object'))) !== null && _b !== void 0 ? _b : []; },
        astNode: node,
    });
}
function makeScalarType(node) {
    return new graphql_1.GraphQLScalarType({
        name: node.name.value,
        description: (0, utils_1.getDescription)(node, backcompatOptions),
        astNode: node,
        // TODO: serialize default property setting can be dropped once
        // upstream graphql-js TypeScript typings are updated, likely in v16
        serialize: value => value,
    });
}
function makeInputObjectType(node) {
    return new graphql_1.GraphQLInputObjectType({
        name: node.name.value,
        description: (0, utils_1.getDescription)(node, backcompatOptions),
        fields: () => (node.fields ? makeValues(node.fields) : {}),
        astNode: node,
    });
}
function makeFields(nodes) {
    return nodes.reduce((prev, node) => {
        var _a;
        return ({
            ...prev,
            [node.name.value]: {
                type: (0, utils_1.createStub)(node.type, 'output'),
                description: (0, utils_1.getDescription)(node, backcompatOptions),
                args: makeValues((_a = node.arguments) !== null && _a !== void 0 ? _a : []),
                deprecationReason: getDeprecationReason(node),
                astNode: node,
            },
        });
    }, {});
}
function makeValues(nodes) {
    return nodes.reduce((prev, node) => ({
        ...prev,
        [node.name.value]: {
            type: (0, utils_1.createStub)(node.type, 'input'),
            defaultValue: node.defaultValue !== undefined ? (0, graphql_1.valueFromASTUntyped)(node.defaultValue) : undefined,
            description: (0, utils_1.getDescription)(node, backcompatOptions),
            astNode: node,
        },
    }), {});
}
function isLocationValue(value) {
    return value in graphql_1.DirectiveLocation;
}
function makeDirective(node) {
    var _a;
    const locations = [];
    for (const location of node.locations) {
        const locationValue = location.value;
        if (isLocationValue(locationValue)) {
            locations.push(locationValue);
        }
    }
    return new graphql_1.GraphQLDirective({
        name: node.name.value,
        description: node.description != null ? node.description.value : null,
        locations: locations,
        isRepeatable: node.repeatable,
        args: makeValues((_a = node.arguments) !== null && _a !== void 0 ? _a : []),
        astNode: node,
    });
}
function getDeprecationReason(node) {
    const deprecated = (0, graphql_1.getDirectiveValues)(graphql_1.GraphQLDeprecatedDirective, node);
    return deprecated === null || deprecated === void 0 ? void 0 : deprecated['reason'];
}
