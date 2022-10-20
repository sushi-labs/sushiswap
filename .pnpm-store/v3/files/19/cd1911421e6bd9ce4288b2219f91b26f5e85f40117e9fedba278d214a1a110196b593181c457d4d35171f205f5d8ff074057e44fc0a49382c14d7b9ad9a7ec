import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
import { processValue } from './utilities.js';
export const GraphQLNonPositiveInt = /*#__PURE__*/ new GraphQLScalarType({
    name: 'NonPositiveInt',
    description: 'Integers that will have a value of 0 or less.',
    serialize(value) {
        return processValue(value, 'NonPositiveInt');
    },
    parseValue(value) {
        return processValue(value, 'NonPositiveInt');
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.INT) {
            throw new GraphQLError(`Can only validate integers as non-positive integers but got a: ${ast.kind}`);
        }
        return processValue(ast.value, 'NonPositiveInt');
    },
    extensions: {
        codegenScalarType: 'number',
    },
});
