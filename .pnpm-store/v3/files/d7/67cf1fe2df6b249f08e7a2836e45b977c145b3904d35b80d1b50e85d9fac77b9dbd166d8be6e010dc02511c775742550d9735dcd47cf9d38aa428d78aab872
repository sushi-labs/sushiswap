// Inspired by Geolib: https://github.com/manuelbieh/geolib
import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';
import { isDecimal, isSexagesimal, sexagesimalToDecimal } from './utilities.js';
// Minimum latitude
const MIN_LAT = -90.0;
// Maximum latitude
const MAX_LAT = 90.0;
// See https://en.wikipedia.org/wiki/Decimal_degrees#Precision
const MAX_PRECISION = 8;
const validate = (value) => {
    // Check if value is a string or a number
    if ((typeof value !== 'string' && typeof value !== 'number') ||
        value === null ||
        typeof value === 'undefined' ||
        Number.isNaN(value)) {
        throw new TypeError(`Value is neither a number nor a string: ${value}`);
    }
    if (isDecimal(value)) {
        const decimalValue = typeof value === 'string' ? Number.parseFloat(value) : value;
        if (decimalValue < MIN_LAT || decimalValue > MAX_LAT) {
            throw new RangeError(`Value must be between ${MIN_LAT} and ${MAX_LAT}: ${value}`);
        }
        return Number.parseFloat(decimalValue.toFixed(MAX_PRECISION));
    }
    if (isSexagesimal(value)) {
        return validate(sexagesimalToDecimal(value));
    }
    throw new TypeError(`Value is not a valid latitude: ${value}`);
};
export const GraphQLLatitude = /*#__PURE__*/ new GraphQLScalarType({
    name: `Latitude`,
    description: `A field whose value is a valid decimal degrees latitude number (53.471): https://en.wikipedia.org/wiki/Latitude`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.FLOAT && ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate floats or strings as latitude but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
