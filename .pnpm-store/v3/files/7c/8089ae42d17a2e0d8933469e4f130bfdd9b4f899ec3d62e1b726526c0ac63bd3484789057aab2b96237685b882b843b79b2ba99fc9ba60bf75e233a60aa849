import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
const RGBA_REGEX = /^rgba\(\s*(-?\d+|-?\d*\.\d+(?=%))(%?)\s*,\s*(-?\d+|-?\d*\.\d+(?=%))(\2)\s*,\s*(-?\d+|-?\d*\.\d+(?=%))(\2)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)$/;
const validate = (value) => {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!RGBA_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid RGBA color: ${value}`);
    }
    return value;
};
export const GraphQLRGBA = 
/*#__PURE__*/ new GraphQLScalarType({
    name: `RGBA`,
    description: `A field whose value is a CSS RGBA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba().`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate strings as RGBA colors but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
