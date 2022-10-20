import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
import { processValue } from './utilities.js';
export const GraphQLNegativeFloat = /*#__PURE__*/ new GraphQLScalarType({
    name: 'NegativeFloat',
    description: 'Floats that will have a value less than 0.',
    serialize(value) {
        return processValue(value, 'NegativeFloat');
    },
    parseValue(value) {
        return processValue(value, 'NegativeFloat');
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.FLOAT && ast.kind !== Kind.INT) {
            throw new GraphQLError(`Can only validate floating point numbers as negative floating point numbers but got a: ${ast.kind}`);
        }
        return processValue(ast.value, 'NegativeFloat');
    },
    extensions: {
        codegenScalarType: 'number',
    },
});
