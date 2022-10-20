import { GraphQLScalarType, Kind, locatedError, } from 'graphql';
const validator = (rtn) => /^([a-zA-Z0-9]){5,17}$/.test(rtn);
const validate = (account) => {
    if (typeof account !== 'string') {
        throw locatedError(new TypeError('can only parse String'), null);
    }
    if (!validator(account)) {
        throw locatedError(new TypeError('must be alphanumeric between 5-17'), null);
    }
    return account;
};
export const GraphQLAccountNumberConfig = {
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
        if (ast.kind === Kind.STRING) {
            return validate(ast.value);
        }
        throw locatedError(new TypeError(`Account Number can only parse String but got '${ast.kind}'`), ast);
    },
};
export const GraphQLAccountNumber = 
/*#__PURE__*/ new GraphQLScalarType(GraphQLAccountNumberConfig);
