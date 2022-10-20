"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLTimeZone = void 0;
const graphql_1 = require("graphql");
const validateTimeZone = (str) => {
    if (!(Intl === null || Intl === void 0 ? void 0 : Intl.DateTimeFormat().resolvedOptions().timeZone)) {
        throw new Error('Time zones are not available in this environment');
    }
    try {
        Intl.DateTimeFormat(undefined, { timeZone: str });
        return str;
    }
    catch (ex) {
        if (ex instanceof RangeError) {
            throw new TypeError(`Value is not a valid IANA time zone: ${str}`);
        }
        else {
            throw new Error('Could not validate time zone.');
        }
    }
};
exports.GraphQLTimeZone = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType({
    name: 'TimeZone',
    description: 'A field whose value exists in the standard IANA Time Zone Database: https://www.iana.org/time-zones',
    serialize: validateTimeZone,
    parseValue: validateTimeZone,
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only sanitize time zone strings, but got: ${ast.kind}`);
        }
        return validateTimeZone(ast.value);
    },
});
