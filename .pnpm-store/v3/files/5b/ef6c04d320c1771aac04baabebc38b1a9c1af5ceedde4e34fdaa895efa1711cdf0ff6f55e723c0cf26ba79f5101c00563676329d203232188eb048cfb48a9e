"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLHSL = exports.GraphQLHSLConfig = void 0;
const graphql_1 = require("graphql");
const validate = (value) => {
    const HSL_REGEX = /^hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)$/;
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!HSL_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid HSL color: ${value}`);
    }
    return value;
};
const specifiedByURL = 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla()';
exports.GraphQLHSLConfig = 
/*#__PURE__*/ {
    name: `HSL`,
    description: `A field whose value is a CSS HSL color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla().`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings as HSL colors but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
    },
};
exports.GraphQLHSL = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType(exports.GraphQLHSLConfig);
