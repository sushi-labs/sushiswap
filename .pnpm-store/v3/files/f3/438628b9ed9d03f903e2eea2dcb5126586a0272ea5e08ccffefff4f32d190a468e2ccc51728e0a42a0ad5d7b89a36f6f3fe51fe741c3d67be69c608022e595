import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
import { processValue } from './utilities.js';
export const GraphQLPositiveFloat = /*#__PURE__*/ new GraphQLScalarType({
    name: 'PositiveFloat',
    description: 'Floats that will have a value greater than 0.',
    serialize(value) {
        return processValue(value, 'PositiveFloat');
    },
    parseValue(value) {
        return processValue(value, 'PositiveFloat');
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.FLOAT && ast.kind !== Kind.INT) {
            throw new GraphQLError(`Can only validate floating point numbers as positive floating point numbers but got a: ${ast.kind}`);
        }
        return processValue(ast.value, 'PositiveFloat');
    },
    extensions: {
        codegenScalarType: 'number',
    },
});
