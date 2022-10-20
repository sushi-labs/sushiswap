"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLHSLA = void 0;
const graphql_1 = require("graphql");
const HSLA_REGEX = /^hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)$/;
const validate = (value) => {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!HSLA_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid HSLA color: ${value}`);
    }
    return value;
};
exports.GraphQLHSLA = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType({
    name: `HSLA`,
    description: `A field whose value is a CSS HSLA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla().`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings as HSLA colors but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
