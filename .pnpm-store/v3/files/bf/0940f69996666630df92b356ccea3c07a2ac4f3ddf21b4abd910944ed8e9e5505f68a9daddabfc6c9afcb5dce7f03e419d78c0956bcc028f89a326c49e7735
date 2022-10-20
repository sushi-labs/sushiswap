import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
import { processValue } from './utilities.js';
export const GraphQLNonNegativeFloatConfig = /*#__PURE__*/ {
    name: 'NonNegativeFloat',
    description: 'Floats that will have a value of 0 or more.',
    serialize(value) {
        return processValue(value, 'NonNegativeFloat');
    },
    parseValue(value) {
        return processValue(value, 'NonNegativeFloat');
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.FLOAT && ast.kind !== Kind.INT) {
            throw new GraphQLError(`Can only validate floating point numbers as non-negative floating point numbers but got a: ${ast.kind}`);
        }
        return processValue(ast.value, 'NonNegativeFloat');
    },
    extensions: {
        codegenScalarType: 'number',
    },
};
export const GraphQLNonNegativeFloat = /*#__PURE__*/ new GraphQLScalarType(GraphQLNonNegativeFloatConfig);
