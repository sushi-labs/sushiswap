"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLJWT = void 0;
const graphql_1 = require("graphql");
// See https://github.com/auth0/node-jws/blob/master/lib/verify-stream.js#L8
const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
const validate = (value) => {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!JWS_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid JWT: ${value}`);
    }
    return value;
};
exports.GraphQLJWT = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType({
    name: `JWT`,
    description: `A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings as JWT but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
