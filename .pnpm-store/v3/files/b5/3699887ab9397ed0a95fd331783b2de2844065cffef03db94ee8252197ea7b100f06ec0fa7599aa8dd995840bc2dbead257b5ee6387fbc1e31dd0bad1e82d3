import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
const validate = (value) => {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not a string: ${value}`);
    }
    if (!value.trim().length) {
        throw new TypeError(`Value cannot be an empty string: ${value}`);
    }
    return value;
};
export const GraphQLNonEmptyString = 
/*#__PURE__*/ new GraphQLScalarType({
    name: 'NonEmptyString',
    description: 'A string that cannot be passed as an empty value',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate strings but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
