import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
const validate = (value) => {
    const UTC_OFFSET_REGEX = /^([+-]?)(\d{2}):(\d{2})$/;
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!UTC_OFFSET_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid UTC Offset: ${value}`);
    }
    return value;
};
export const GraphQLUtcOffset = 
/*#__PURE__*/ new GraphQLScalarType({
    name: 'UtcOffset',
    description: 'A field whose value is a UTC Offset: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate strings as UTC Offset but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
