"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLPositiveFloat = void 0;
const graphql_1 = require("graphql");
const utilities_js_1 = require("./utilities.js");
exports.GraphQLPositiveFloat = new graphql_1.GraphQLScalarType({
    name: 'PositiveFloat',
    description: 'Floats that will have a value greater than 0.',
    serialize(value) {
        return (0, utilities_js_1.processValue)(value, 'PositiveFloat');
    },
    parseValue(value) {
        return (0, utilities_js_1.processValue)(value, 'PositiveFloat');
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.FLOAT && ast.kind !== graphql_1.Kind.INT) {
            throw new graphql_1.GraphQLError(`Can only validate floating point numbers as positive floating point numbers but got a: ${ast.kind}`);
        }
        return (0, utilities_js_1.processValue)(ast.value, 'PositiveFloat');
    },
    extensions: {
        codegenScalarType: 'number',
    },
});
