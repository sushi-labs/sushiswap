import { Kind, GraphQLError, GraphQLScalarType, } from 'graphql';
const validate = (value) => {
    const CUID_REGEX = /^c[^\s-]{8,}$/i;
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!CUID_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid cuid: ${value}`);
    }
    return value;
};
const specifiedByURL = 'https://github.com/ericelliott/cuid#broken-down';
export const GraphQLCuidConfig = /*#__PURE__*/ {
    name: 'Cuid',
    description: 'A field whose value conforms to the standard cuid format as specified in https://github.com/ericelliott/cuid#broken-down',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate strings as cuids but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
    },
};
export const GraphQLCuid = 
/*#__PURE__*/ new GraphQLScalarType(GraphQLCuidConfig);
