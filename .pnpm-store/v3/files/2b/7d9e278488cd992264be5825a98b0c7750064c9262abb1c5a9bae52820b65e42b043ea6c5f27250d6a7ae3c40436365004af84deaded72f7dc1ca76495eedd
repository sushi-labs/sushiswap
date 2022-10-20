"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLHexadecimal = exports.GraphQLHexadecimalConfig = void 0;
const graphql_1 = require("graphql");
const validate = (value) => {
    const HEXADECIMAL_REGEX = /^[a-f0-9]+$/i;
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!HEXADECIMAL_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid hexadecimal value: ${value}`);
    }
    return value;
};
exports.GraphQLHexadecimalConfig = 
/*#__PURE__*/ {
    name: `Hexadecimal`,
    description: `A field whose value is a hexadecimal: https://en.wikipedia.org/wiki/Hexadecimal.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings as a hexadecimal but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
};
exports.GraphQLHexadecimal = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType(exports.GraphQLHexadecimalConfig);
