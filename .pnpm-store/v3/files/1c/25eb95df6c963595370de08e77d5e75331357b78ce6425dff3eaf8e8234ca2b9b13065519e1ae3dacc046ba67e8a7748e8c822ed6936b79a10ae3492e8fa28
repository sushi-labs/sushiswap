import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';
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
export const GraphQLJWT = 
/*#__PURE__*/ new GraphQLScalarType({
    name: `JWT`,
    description: `A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate strings as JWT but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
