/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { GraphQLScalarType, Kind } from 'graphql';
import { validateJSDate, validateTime } from './validator.js';
import { serializeTime, serializeTimeString, parseTime } from './formatter.js';
/**
 * An RFC 3339 compliant time scalar.
 *
 * Input:
 *    This scalar takes an RFC 3339 time string as input and
 *    parses it to a javascript Date (with a year-month-day relative
 *    to the current day).
 *
 * Output:
 *    This scalar serializes javascript Dates and
 *    RFC 3339 time strings to RFC 3339 UTC time strings.
 */
const config = {
    name: 'Time',
    description: 'A time string at UTC, such as 10:15:30Z, compliant with ' +
        'the `full-time` format outlined in section 5.6 of the RFC 3339' +
        'profile of the ISO 8601 standard for representation of dates and ' +
        'times using the Gregorian calendar.',
    serialize(value) {
        if (value instanceof Date) {
            if (validateJSDate(value)) {
                return serializeTime(value);
            }
            throw new TypeError('Time cannot represent an invalid Date instance');
        }
        else if (typeof value === 'string') {
            if (validateTime(value)) {
                return serializeTimeString(value);
            }
            throw new TypeError(`Time cannot represent an invalid time-string ${value}.`);
        }
        else {
            throw new TypeError('Time cannot be serialized from a non string, ' + 'or non Date type ' + JSON.stringify(value));
        }
    },
    parseValue(value) {
        if (!(typeof value === 'string')) {
            throw new TypeError(`Time cannot represent non string type ${JSON.stringify(value)}`);
        }
        if (validateTime(value)) {
            return parseTime(value);
        }
        throw new TypeError(`Time cannot represent an invalid time-string ${value}.`);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new TypeError(`Time cannot represent non string type ${'value' in ast && ast.value}`);
        }
        const value = ast.value;
        if (validateTime(value)) {
            return parseTime(value);
        }
        throw new TypeError(`Time cannot represent an invalid time-string ${String(value)}.`);
    },
    extensions: {
        codegenScalarType: 'Date | string',
    },
};
export const GraphQLTime = /*#__PURE__*/ new GraphQLScalarType(config);
