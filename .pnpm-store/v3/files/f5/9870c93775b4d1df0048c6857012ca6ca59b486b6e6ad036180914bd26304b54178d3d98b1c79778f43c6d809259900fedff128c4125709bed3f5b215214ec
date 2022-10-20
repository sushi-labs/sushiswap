"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLLocalDate = void 0;
const graphql_1 = require("graphql");
const LOCAL_DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;
function validateLocalDate(value) {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    // check that it's in the `yyyy-MM-dd` format
    const isValidFormat = LOCAL_DATE_FORMAT.test(value);
    if (!isValidFormat) {
        throw new TypeError(`Value is not a valid LocalDate: ${value}`);
    }
    // check that it appears to be a valid date, e.g., not something like `2020-13-46`
    const valueAsDate = new Date(value);
    const isValidDate = !isNaN(valueAsDate.getTime());
    if (!isValidDate) {
        throw new TypeError(`Value is not a valid LocalDate: ${value}`);
    }
    // some additional logic to catch invalid dates like `2020-02-30`
    // that we catch by serializing the Date object into an ISO string and checking that our serialized date matches
    // the original value
    const isCalendarDate = valueAsDate.toISOString() === `${value}T00:00:00.000Z`;
    if (!isCalendarDate) {
        throw new TypeError(`Value is not a valid LocalDate: ${value}`);
    }
    return value;
}
exports.GraphQLLocalDate = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType({
    name: 'LocalDate',
    description: 'A local date string (i.e., with no associated timezone) in `YYYY-MM-DD` format, e.g. `2020-01-01`.',
    serialize(value) {
        // value sent to client as string
        return validateLocalDate(value);
    },
    parseValue(value) {
        // value from client as json
        return validateLocalDate(value);
    },
    parseLiteral(ast) {
        // value from client in ast
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings as local dates but got a: ${ast.kind}`);
        }
        return validateLocalDate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
