"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLNonEmptyString = void 0;
const graphql_1 = require("graphql");
const validate = (value) => {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not a string: ${value}`);
    }
    if (!value.trim().length) {
        throw new TypeError(`Value cannot be an empty string: ${value}`);
    }
    return value;
};
exports.GraphQLNonEmptyString = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType({
    name: 'NonEmptyString',
    description: 'A string that cannot be passed as an empty value',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
