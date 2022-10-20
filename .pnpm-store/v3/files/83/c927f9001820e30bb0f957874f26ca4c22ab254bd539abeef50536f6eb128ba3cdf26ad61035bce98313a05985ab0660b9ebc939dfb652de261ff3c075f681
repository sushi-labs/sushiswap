"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLURL = void 0;
const graphql_1 = require("graphql");
exports.GraphQLURL = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType({
    name: 'URL',
    description: 'A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt.',
    serialize(value) {
        if (value === null) {
            return value;
        }
        return new URL(value.toString()).toString();
    },
    parseValue: (value) => (value === null ? value : new URL(value.toString())),
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings as URLs but got a: ${ast.kind}`);
        }
        if (ast.value === null) {
            return ast.value;
        }
        else {
            return new URL(ast.value.toString());
        }
    },
    extensions: {
        codegenScalarType: 'URL | string',
    },
});
