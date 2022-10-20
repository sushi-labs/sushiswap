import { GraphQLScalarType, Kind, GraphQLError } from 'graphql';
// 24-hour time with optional seconds and milliseconds - `HH:mm[:ss[.SSS]]`
const LOCAL_TIME_FORMAT = /^([0-1][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9](\.\d{3})?)?$/;
export function validateLocalTime(value) {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    const isValidFormat = LOCAL_TIME_FORMAT.test(value);
    if (!isValidFormat) {
        throw new TypeError(`Value is not a valid LocalTime: ${value}`);
    }
    return value;
}
export const GraphQLLocalTime = 
/*#__PURE__*/ new GraphQLScalarType({
    name: 'LocalTime',
    description: 'A local time string (i.e., with no associated timezone) in 24-hr `HH:mm[:ss[.SSS]]` format, e.g. `14:25` or `14:25:06` or `14:25:06.123`.',
    serialize(value) {
        // value sent to client as string
        return validateLocalTime(value);
    },
    parseValue(value) {
        // value from client as json
        return validateLocalTime(value);
    },
    parseLiteral(ast) {
        // value from client in ast
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate strings as local times but got a: ${ast.kind}`);
        }
        return validateLocalTime(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
