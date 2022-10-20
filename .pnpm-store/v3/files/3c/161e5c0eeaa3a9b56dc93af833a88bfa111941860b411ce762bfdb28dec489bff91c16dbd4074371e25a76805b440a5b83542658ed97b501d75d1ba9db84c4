"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLMAC = void 0;
const graphql_1 = require("graphql");
const MAC_REGEX = /^(?:[0-9A-Fa-f]{2}([:-]?)[0-9A-Fa-f]{2})(?:(?:\1|\.)(?:[0-9A-Fa-f]{2}([:-]?)[0-9A-Fa-f]{2})){2}$/;
const validate = (value) => {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!MAC_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid MAC address: ${value}`);
    }
    return value;
};
exports.GraphQLMAC = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType({
    name: `MAC`,
    description: `A field whose value is a IEEE 802 48-bit MAC address: https://en.wikipedia.org/wiki/MAC_address.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings as MAC addresses but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
