import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
export const IPV4_REGEX = /^(?:(?:(?:0?0?[0-9]|0?[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}(?:0?0?[0-9]|0?[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?)$/;
const validate = (value) => {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!IPV4_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid IPv4 address: ${value}`);
    }
    return value;
};
export const GraphQLIPv4 = /*#__PURE__*/ new GraphQLScalarType({
    name: `IPv4`,
    description: `A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate strings as IPv4 addresses but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
