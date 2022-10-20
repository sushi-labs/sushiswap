import { Kind, GraphQLError, GraphQLScalarType, } from 'graphql';
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
export const GraphQLHexadecimalConfig = 
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
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate strings as a hexadecimal but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
};
export const GraphQLHexadecimal = 
/*#__PURE__*/ new GraphQLScalarType(GraphQLHexadecimalConfig);
