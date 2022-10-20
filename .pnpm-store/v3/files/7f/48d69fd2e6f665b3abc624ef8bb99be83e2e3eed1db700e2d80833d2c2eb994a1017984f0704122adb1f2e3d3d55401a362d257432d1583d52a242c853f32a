"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLRGB = void 0;
const graphql_1 = require("graphql");
const RGB_REGEX = /^rgb\(\s*(-?\d+|-?\d*\.\d+(?=%))(%?)\s*,\s*(-?\d+|-?\d*\.\d+(?=%))(\2)\s*,\s*(-?\d+|-?\d*\.\d+(?=%))(\2)\s*\)$/;
const validate = (value) => {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!RGB_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid RGB color: ${value}`);
    }
    return value;
};
exports.GraphQLRGB = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType({
    name: `RGB`,
    description: `A field whose value is a CSS RGB color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba().`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings as RGB colors but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
