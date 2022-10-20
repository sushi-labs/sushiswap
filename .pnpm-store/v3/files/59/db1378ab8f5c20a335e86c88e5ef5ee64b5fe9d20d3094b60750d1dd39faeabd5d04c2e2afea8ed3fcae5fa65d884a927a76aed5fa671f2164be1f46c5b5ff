"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLDID = exports.GraphQLDIDConfig = void 0;
const graphql_1 = require("graphql");
// See: https://www.w3.org/TR/2021/PR-did-core-20210803/#did-syntax
const DID_REGEX = /^did:[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+:[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+$/;
const validate = (value) => {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!DID_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid DID: ${value}`);
    }
    return value;
};
const specifiedByURL = 'https://www.w3.org/TR/did-core/';
exports.GraphQLDIDConfig = {
    name: 'DID',
    description: 'A field whose value conforms to the standard DID format as specified in did-core: https://www.w3.org/TR/did-core/.',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings as DID but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
    },
};
exports.GraphQLDID = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType(exports.GraphQLDIDConfig);
