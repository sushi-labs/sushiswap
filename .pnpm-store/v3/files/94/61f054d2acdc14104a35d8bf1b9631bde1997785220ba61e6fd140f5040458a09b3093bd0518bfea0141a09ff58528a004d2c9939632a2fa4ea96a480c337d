"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLNegativeInt = void 0;
const graphql_1 = require("graphql");
const utilities_js_1 = require("./utilities.js");
exports.GraphQLNegativeInt = new graphql_1.GraphQLScalarType({
    name: 'NegativeInt',
    description: 'Integers that will have a value less than 0.',
    serialize(value) {
        return (0, utilities_js_1.processValue)(value, 'NegativeInt');
    },
    parseValue(value) {
        return (0, utilities_js_1.processValue)(value, 'NegativeInt');
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.INT) {
            throw new graphql_1.GraphQLError(`Can only validate integers as negative integers but got a: ${ast.kind}`);
        }
        return (0, utilities_js_1.processValue)(ast.value, 'NegativeInt');
    },
    extensions: {
        codegenScalarType: 'number',
    },
});
