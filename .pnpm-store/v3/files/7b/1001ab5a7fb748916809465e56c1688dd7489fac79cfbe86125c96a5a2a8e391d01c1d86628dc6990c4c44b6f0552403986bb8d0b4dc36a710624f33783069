"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegularExpression = void 0;
const graphql_1 = require("graphql");
class RegularExpression extends graphql_1.GraphQLScalarType {
    constructor(name, regex, options = {}) {
        const errorMessage = options.errorMessage
            ? options.errorMessage
            : (r, v) => `Value does not match ${r}: ${v}`;
        super({
            name,
            description: options.description || `A field whose value matches ${regex}.`,
            serialize(value) {
                if (value != null && !regex.test(value.toString())) {
                    throw new TypeError(errorMessage(regex, value));
                }
                return value;
            },
            parseValue(value) {
                if (value != null && !regex.test(value === null || value === void 0 ? void 0 : value.toString())) {
                    throw new TypeError(errorMessage(regex, value));
                }
                return value;
            },
            parseLiteral(ast) {
                if (ast.kind === graphql_1.Kind.NULL) {
                    return null;
                }
                if (options.stringOnly && ast.kind !== graphql_1.Kind.STRING) {
                    throw new graphql_1.GraphQLError(`Can only validate strings as ${name} but got a: ${ast.kind}`);
                }
                if (!('value' in ast) || ast.kind === graphql_1.Kind.ENUM) {
                    throw new graphql_1.GraphQLError(`Can only validate primitive values as ${name} but got a: ${ast.kind}`);
                }
                if (ast.value != null && !regex.test(ast.value.toString())) {
                    throw new TypeError(errorMessage(regex, ast.value));
                }
                return ast.value;
            },
            extensions: {
                codegenScalarType: options.stringOnly
                    ? 'string'
                    : 'string | number | boolean',
            },
        });
    }
}
exports.RegularExpression = RegularExpression;
