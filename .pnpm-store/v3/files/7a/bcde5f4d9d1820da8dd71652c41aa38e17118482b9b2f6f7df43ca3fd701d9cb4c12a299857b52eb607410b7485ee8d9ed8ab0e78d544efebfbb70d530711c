"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLIP = void 0;
const graphql_1 = require("graphql");
const IPv4_js_1 = require("./IPv4.js");
const IPv6_js_1 = require("./IPv6.js");
const validate = (value) => {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!IPv4_js_1.IPV4_REGEX.test(value) && !IPv6_js_1.IPV6_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid IPv4 or IPv6 address: ${value}`);
    }
    return value;
};
exports.GraphQLIP = new graphql_1.GraphQLScalarType({
    name: `IP`,
    description: `A field whose value is either an IPv4 or IPv6 address: https://en.wikipedia.org/wiki/IP_address.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings as IP addresses but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
