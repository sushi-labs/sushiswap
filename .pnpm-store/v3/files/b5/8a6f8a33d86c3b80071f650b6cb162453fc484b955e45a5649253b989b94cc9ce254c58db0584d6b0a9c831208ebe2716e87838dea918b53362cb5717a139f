"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLNonNegativeFloat = exports.GraphQLNonNegativeFloatConfig = void 0;
const graphql_1 = require("graphql");
const utilities_js_1 = require("./utilities.js");
exports.GraphQLNonNegativeFloatConfig = {
    name: 'NonNegativeFloat',
    description: 'Floats that will have a value of 0 or more.',
    serialize(value) {
        return (0, utilities_js_1.processValue)(value, 'NonNegativeFloat');
    },
    parseValue(value) {
        return (0, utilities_js_1.processValue)(value, 'NonNegativeFloat');
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.FLOAT && ast.kind !== graphql_1.Kind.INT) {
            throw new graphql_1.GraphQLError(`Can only validate floating point numbers as non-negative floating point numbers but got a: ${ast.kind}`);
        }
        return (0, utilities_js_1.processValue)(ast.value, 'NonNegativeFloat');
    },
    extensions: {
        codegenScalarType: 'number',
    },
};
exports.GraphQLNonNegativeFloat = new graphql_1.GraphQLScalarType(exports.GraphQLNonNegativeFloatConfig);
