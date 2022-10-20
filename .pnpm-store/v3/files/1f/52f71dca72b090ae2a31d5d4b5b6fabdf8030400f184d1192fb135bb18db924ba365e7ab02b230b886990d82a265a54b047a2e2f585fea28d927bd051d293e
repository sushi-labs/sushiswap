// Based on https://github.com/stems/graphql-bigint/
import { GraphQLError, GraphQLScalarType, Kind, print } from 'graphql';
import { serializeObject } from './utilities.js';
const specifiedByURL = 'https://www.ecma-international.org/ecma-262/#sec-number.issafeinteger';
export const GraphQLSafeIntConfig = {
    name: 'SafeInt',
    description: 'The `SafeInt` scalar type represents non-fractional signed whole numeric values that are ' +
        'considered safe as defined by the ECMAScript specification.',
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    serialize(outputValue) {
        const coercedValue = serializeObject(outputValue);
        if (typeof coercedValue === 'boolean') {
            return coercedValue ? 1 : 0;
        }
        let num = coercedValue;
        if (typeof coercedValue === 'string' && coercedValue !== '') {
            num = Number(coercedValue);
        }
        if (typeof num !== 'number' || !Number.isInteger(num)) {
            throw new GraphQLError(`SafeInt cannot represent non-integer value: ${coercedValue}`);
        }
        if (!Number.isSafeInteger(num)) {
            throw new GraphQLError('SafeInt cannot represent unsafe integer value: ' + coercedValue);
        }
        return num;
    },
    parseValue(inputValue) {
        if (typeof inputValue !== 'number' || !Number.isInteger(inputValue)) {
            throw new GraphQLError(`SafeInt cannot represent non-integer value: ${inputValue}`);
        }
        if (!Number.isSafeInteger(inputValue)) {
            throw new GraphQLError(`SafeInt cannot represent unsafe integer value: ${inputValue}`);
        }
        return inputValue;
    },
    parseLiteral(valueNode) {
        if (valueNode.kind !== Kind.INT) {
            throw new GraphQLError(`SafeInt cannot represent non-integer value: ${print(valueNode)}`, valueNode);
        }
        const num = parseInt(valueNode.value, 10);
        if (!Number.isSafeInteger(num)) {
            throw new GraphQLError(`SafeInt cannot represent unsafe integer value: ${valueNode.value}`, valueNode);
        }
        return num;
    },
    extensions: {
        codegenScalarType: 'number',
    },
};
export const GraphQLSafeInt = /*#__PURE__*/ new GraphQLScalarType(GraphQLSafeIntConfig);
