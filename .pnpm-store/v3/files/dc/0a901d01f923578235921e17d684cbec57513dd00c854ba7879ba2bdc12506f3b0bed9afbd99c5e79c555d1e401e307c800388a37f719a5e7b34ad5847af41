/* eslint-disable @typescript-eslint/ban-types */
import { Kind, GraphQLScalarType, GraphQLError, print } from 'graphql';
import { serializeObject } from './utilities.js';
export const GraphQLBigIntConfig = /*#__PURE__*/ {
    name: 'BigInt',
    description: 'The `BigInt` scalar type represents non-fractional signed whole numeric values.',
    serialize(outputValue) {
        const coercedValue = serializeObject(outputValue);
        let num = coercedValue;
        if (typeof coercedValue === 'object' && coercedValue != null && 'toString' in coercedValue) {
            num = BigInt(coercedValue.toString());
            if (num.toString() !== coercedValue.toString()) {
                throw new GraphQLError(`BigInt cannot represent non-integer value: ${coercedValue}`);
            }
        }
        if (typeof coercedValue === 'boolean') {
            num = BigInt(coercedValue);
        }
        if (typeof coercedValue === 'string' && coercedValue !== '') {
            num = BigInt(coercedValue);
            if (num.toString() !== coercedValue) {
                throw new GraphQLError(`BigInt cannot represent non-integer value: ${coercedValue}`);
            }
        }
        if (typeof coercedValue === 'number') {
            if (!Number.isInteger(coercedValue)) {
                throw new GraphQLError(`BigInt cannot represent non-integer value: ${coercedValue}`);
            }
            num = BigInt(coercedValue);
        }
        if (typeof num !== 'bigint') {
            throw new GraphQLError(`BigInt cannot represent non-integer value: ${coercedValue}`);
        }
        if ('toJSON' in BigInt.prototype) {
            return num;
        }
        return new Proxy({}, {
            has(_, prop) {
                if (prop === 'toJSON') {
                    return true;
                }
                return prop in BigInt.prototype;
            },
            get(_, prop) {
                if (prop === 'toJSON') {
                    return function toJSON() {
                        if (num > Number.MAX_SAFE_INTEGER) {
                            return num.toString();
                        }
                        return Number(num);
                    };
                }
                if (prop === Symbol.toStringTag) {
                    return num.toString();
                }
                if (prop in BigInt.prototype) {
                    return BigInt.prototype[prop].bind(num);
                }
                return undefined;
            },
        });
    },
    parseValue(inputValue) {
        const num = BigInt(inputValue.toString());
        if (inputValue.toString() !== num.toString()) {
            throw new GraphQLError(`BigInt cannot represent value: ${inputValue}`);
        }
        return num;
    },
    parseLiteral(valueNode) {
        if (valueNode.kind !== Kind.INT) {
            throw new GraphQLError(`BigInt cannot represent non-integer value: ${print(valueNode)}`, valueNode);
        }
        const num = BigInt(valueNode.value);
        if (num.toString() !== valueNode.value) {
            throw new GraphQLError(`BigInt cannot represent value: ${valueNode.value}`, valueNode);
        }
        return num;
    },
    extensions: {
        codegenScalarType: 'bigint',
    },
};
export const GraphQLBigInt = /*#__PURE__*/ new GraphQLScalarType(GraphQLBigIntConfig);
