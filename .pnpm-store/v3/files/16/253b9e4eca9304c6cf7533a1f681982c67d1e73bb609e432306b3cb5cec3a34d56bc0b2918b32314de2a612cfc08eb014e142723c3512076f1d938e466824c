"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLObjectID = void 0;
const graphql_1 = require("graphql");
const MONGODB_OBJECTID_REGEX = /*#__PURE__*/ /^[A-Fa-f0-9]{24}$/;
exports.GraphQLObjectID = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType({
    name: 'ObjectID',
    description: 'A field whose value conforms with the standard mongodb object ID as described here: https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId. Example: 5e5677d71bdc2ae76344968c',
    serialize(value) {
        if (!MONGODB_OBJECTID_REGEX.test(value)) {
            throw new TypeError(`Value is not a valid mongodb object id of form: ${value}`);
        }
        return value;
    },
    parseValue(value) {
        if (!MONGODB_OBJECTID_REGEX.test(value)) {
            throw new TypeError(`Value is not a valid mongodb object id of form: ${value}`);
        }
        return value;
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings as mongodb object id but got a: ${ast.kind}`);
        }
        if (!MONGODB_OBJECTID_REGEX.test(ast.value)) {
            throw new TypeError(`Value is not a valid mongodb object id of form: ${ast.value}`);
        }
        return ast.value;
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
