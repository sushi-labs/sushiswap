import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
import { processValue } from './utilities.js';
export const GraphQLNegativeInt = /*#__PURE__*/ new GraphQLScalarType({
    name: 'NegativeInt',
    description: 'Integers that will have a value less than 0.',
    serialize(value) {
        return processValue(value, 'NegativeInt');
    },
    parseValue(value) {
        return processValue(value, 'NegativeInt');
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.INT) {
            throw new GraphQLError(`Can only validate integers as negative integers but got a: ${ast.kind}`);
        }
        return processValue(ast.value, 'NegativeInt');
    },
    extensions: {
        codegenScalarType: 'number',
    },
});
