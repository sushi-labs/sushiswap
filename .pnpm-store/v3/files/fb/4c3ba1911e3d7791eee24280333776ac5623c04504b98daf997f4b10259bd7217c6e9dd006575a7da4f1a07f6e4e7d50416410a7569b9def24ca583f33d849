"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLAccountNumber = exports.GraphQLAccountNumberConfig = void 0;
const graphql_1 = require("graphql");
const validator = (rtn) => /^([a-zA-Z0-9]){5,17}$/.test(rtn);
const validate = (account) => {
    if (typeof account !== 'string') {
        throw (0, graphql_1.locatedError)(new TypeError('can only parse String'), null);
    }
    if (!validator(account)) {
        throw (0, graphql_1.locatedError)(new TypeError('must be alphanumeric between 5-17'), null);
    }
    return account;
};
exports.GraphQLAccountNumberConfig = {
    name: 'AccountNumber',
    description: 'Banking account number is a string of 5 to 17 alphanumeric values for ' +
        'representing an generic account number',
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.STRING) {
            return validate(ast.value);
        }
        throw (0, graphql_1.locatedError)(new TypeError(`Account Number can only parse String but got '${ast.kind}'`), ast);
    },
};
exports.GraphQLAccountNumber = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType(exports.GraphQLAccountNumberConfig);
