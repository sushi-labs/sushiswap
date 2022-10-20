import { GraphQLEnumType, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLObjectType, GraphQLScalarType, GraphQLUnionType, Kind, GraphQLDirective, DirectiveLocation, valueFromASTUntyped, getDirectiveValues, GraphQLDeprecatedDirective, } from 'graphql';
import { createStub, createNamedStub, getDescription } from '@graphql-tools/utils';
const backcompatOptions = { commentDescriptions: true };
export default typeFromAST;
function typeFromAST(node) {
    switch (node.kind) {
        case Kind.OBJECT_TYPE_DEFINITION:
            return makeObjectType(node);
        case Kind.INTERFACE_TYPE_DEFINITION:
            return makeInterfaceType(node);
        case Kind.ENUM_TYPE_DEFINITION:
            return makeEnumType(node);
        case Kind.UNION_TYPE_DEFINITION:
            return makeUnionType(node);
        case Kind.SCALAR_TYPE_DEFINITION:
            return makeScalarType(node);
        case Kind.INPUT_OBJECT_TYPE_DEFINITION:
            return makeInputObjectType(node);
        case Kind.DIRECTIVE_DEFINITION:
            return makeDirective(node);
        default:
            return null;
    }
}
function makeObjectType(node) {
    const config = {
        name: node.name.value,
        description: getDescription(node, backcompatOptions),
        interfaces: () => { var _a; return ((_a = node.interfaces) === null || _a === void 0 ? void 0 : _a.map(iface => createNamedStub(iface.name.value, 'interface'))) || []; },
        fields: () => (node.fields != null ? makeFields(node.fields) : {}),
        astNode: node,
    };
    return new GraphQLObjectType(config);
}
function makeInterfaceType(node) {
    const config = {
        name: node.name.value,
        description: getDescription(node, backcompatOptions),
        interfaces: () => {
            var _a;
            return (_a = node.interfaces) === null || _a === void 0 ? void 0 : _a.map(iface => createNamedStub(iface.name.value, 'interface'));
        },
        fields: () => (node.fields != null ? makeFields(node.fields) : {}),
        astNode: node,
    };
    return new GraphQLInterfaceType(config);
}
function makeEnumType(node) {
    var _a, _b;
    const values = (_b = (_a = node.values) === null || _a === void 0 ? void 0 : _a.reduce((prev, value) => ({
        ...prev,
        [value.name.value]: {
            description: getDescription(value, backcompatOptions),
            deprecationReason: getDeprecationReason(value),
            astNode: value,
        },
    }), {})) !== null && _b !== void 0 ? _b : {};
    return new GraphQLEnumType({
        name: node.name.value,
        description: getDescription(node, backcompatOptions),
        values,
        astNode: node,
    });
}
function makeUnionType(node) {
    return new GraphQLUnionType({
        name: node.name.value,
        description: getDescription(node, backcompatOptions),
        types: () => { var _a, _b; return (_b = (_a = node.types) === null || _a === void 0 ? void 0 : _a.map(type => createNamedStub(type.name.value, 'object'))) !== null && _b !== void 0 ? _b : []; },
        astNode: node,
    });
}
function makeScalarType(node) {
    return new GraphQLScalarType({
        name: node.name.value,
        description: getDescription(node, backcompatOptions),
        astNode: node,
        // TODO: serialize default property setting can be dropped once
        // upstream graphql-js TypeScript typings are updated, likely in v16
        serialize: value => value,
    });
}
function makeInputObjectType(node) {
    return new GraphQLInputObjectType({
        name: node.name.value,
        description: getDescription(node, backcompatOptions),
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
                type: createStub(node.type, 'output'),
                description: getDescription(node, backcompatOptions),
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
            type: createStub(node.type, 'input'),
            defaultValue: node.defaultValue !== undefined ? valueFromASTUntyped(node.defaultValue) : undefined,
            description: getDescription(node, backcompatOptions),
            astNode: node,
        },
    }), {});
}
function isLocationValue(value) {
    return value in DirectiveLocation;
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
    return new GraphQLDirective({
        name: node.name.value,
        description: node.description != null ? node.description.value : null,
        locations: locations,
        isRepeatable: node.repeatable,
        args: makeValues((_a = node.arguments) !== null && _a !== void 0 ? _a : []),
        astNode: node,
    });
}
function getDeprecationReason(node) {
    const deprecated = getDirectiveValues(GraphQLDeprecatedDirective, node);
    return deprecated === null || deprecated === void 0 ? void 0 : deprecated['reason'];
}
