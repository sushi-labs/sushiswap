"use strict";
// Based on https://github.com/stems/graphql-bigint/
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLSafeInt = exports.GraphQLSafeIntConfig = void 0;
const graphql_1 = require("graphql");
const utilities_js_1 = require("./utilities.js");
const specifiedByURL = 'https://www.ecma-international.org/ecma-262/#sec-number.issafeinteger';
exports.GraphQLSafeIntConfig = {
    name: 'SafeInt',
    description: 'The `SafeInt` scalar type represents non-fractional signed whole numeric values that are ' +
        'considered safe as defined by the ECMAScript specification.',
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    serialize(outputValue) {
        const coercedValue = (0, utilities_js_1.serializeObject)(outputValue);
        if (typeof coercedValue === 'boolean') {
            return coercedValue ? 1 : 0;
        }
        let num = coercedValue;
        if (typeof coercedValue === 'string' && coercedValue !== '') {
            num = Number(coercedValue);
        }
        if (typeof num !== 'number' || !Number.isInteger(num)) {
            throw new graphql_1.GraphQLError(`SafeInt cannot represent non-integer value: ${coercedValue}`);
        }
        if (!Number.isSafeInteger(num)) {
            throw new graphql_1.GraphQLError('SafeInt cannot represent unsafe integer value: ' + coercedValue);
        }
        return num;
    },
    parseValue(inputValue) {
        if (typeof inputValue !== 'number' || !Number.isInteger(inputValue)) {
            throw new graphql_1.GraphQLError(`SafeInt cannot represent non-integer value: ${inputValue}`);
        }
        if (!Number.isSafeInteger(inputValue)) {
            throw new graphql_1.GraphQLError(`SafeInt cannot represent unsafe integer value: ${inputValue}`);
        }
        return inputValue;
    },
    parseLiteral(valueNode) {
        if (valueNode.kind !== graphql_1.Kind.INT) {
            throw new graphql_1.GraphQLError(`SafeInt cannot represent non-integer value: ${(0, graphql_1.print)(valueNode)}`, valueNode);
        }
        const num = parseInt(valueNode.value, 10);
        if (!Number.isSafeInteger(num)) {
            throw new graphql_1.GraphQLError(`SafeInt cannot represent unsafe integer value: ${valueNode.value}`, valueNode);
        }
        return num;
    },
    extensions: {
        codegenScalarType: 'number',
    },
};
exports.GraphQLSafeInt = new graphql_1.GraphQLScalarType(exports.GraphQLSafeIntConfig);
