"use strict";
/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLDateTime = exports.GraphQLDateTimeConfig = void 0;
const graphql_1 = require("graphql");
const validator_js_1 = require("./validator.js");
const formatter_js_1 = require("./formatter.js");
exports.GraphQLDateTimeConfig = {
    name: 'DateTime',
    description: 'A date-time string at UTC, such as 2007-12-03T10:15:30Z, ' +
        'compliant with the `date-time` format outlined in section 5.6 of ' +
        'the RFC 3339 profile of the ISO 8601 standard for representation ' +
        'of dates and times using the Gregorian calendar.',
    serialize(value) {
        if (value instanceof Date) {
            if ((0, validator_js_1.validateJSDate)(value)) {
                return value;
            }
            throw new TypeError('DateTime cannot represent an invalid Date instance');
        }
        else if (typeof value === 'string') {
            if ((0, validator_js_1.validateDateTime)(value)) {
                return (0, formatter_js_1.parseDateTime)(value);
            }
            throw new TypeError(`DateTime cannot represent an invalid date-time-string ${value}.`);
        }
        else if (typeof value === 'number') {
            try {
                return new Date(value);
            }
            catch (e) {
                throw new TypeError('DateTime cannot represent an invalid Unix timestamp ' + value);
            }
        }
        else {
            throw new TypeError('DateTime cannot be serialized from a non string, ' + 'non numeric or non Date type ' + JSON.stringify(value));
        }
    },
    parseValue(value) {
        if (value instanceof Date) {
            if ((0, validator_js_1.validateJSDate)(value)) {
                return value;
            }
            throw new TypeError('DateTime cannot represent an invalid Date instance');
        }
        if (typeof value === 'string') {
            if ((0, validator_js_1.validateDateTime)(value)) {
                return (0, formatter_js_1.parseDateTime)(value);
            }
            throw new TypeError(`DateTime cannot represent an invalid date-time-string ${value}.`);
        }
        throw new TypeError(`DateTime cannot represent non string or Date type ${JSON.stringify(value)}`);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new TypeError(`DateTime cannot represent non string or Date type ${'value' in ast && ast.value}`);
        }
        const { value } = ast;
        if ((0, validator_js_1.validateDateTime)(value)) {
            return (0, formatter_js_1.parseDateTime)(value);
        }
        throw new TypeError(`DateTime cannot represent an invalid date-time-string ${String(value)}.`);
    },
    extensions: {
        codegenScalarType: 'Date | string',
    },
};
/**
 * An RFC 3339 compliant date-time scalar.
 *
 * Input:
 *    This scalar takes an RFC 3339 date-time string as input and
 *    parses it to a javascript Date.
 *
 * Output:
 *    This scalar serializes javascript Dates,
 *    RFC 3339 date-time strings and unix timestamps
 *    to RFC 3339 UTC date-time strings.
 */
exports.GraphQLDateTime = new graphql_1.GraphQLScalarType(exports.GraphQLDateTimeConfig);
