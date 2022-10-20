import { Kind, GraphQLError, GraphQLScalarType, } from 'graphql';
const validate = (value) => {
    const EMAIL_ADDRESS_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!EMAIL_ADDRESS_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid email address: ${value}`);
    }
    return value;
};
const specifiedByURL = 'https://www.w3.org/Protocols/rfc822/';
export const GraphQLEmailAddressConfig = /*#__PURE__*/ {
    name: 'EmailAddress',
    description: 'A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.',
    serialize: validate,
    parseValue: validate,
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate strings as email addresses but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
    },
};
export const GraphQLEmailAddress = 
/*#__PURE__*/ new GraphQLScalarType(GraphQLEmailAddressConfig);
