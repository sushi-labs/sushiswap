import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
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
export const GraphQLHSLA = 
/*#__PURE__*/ new GraphQLScalarType({
    name: `HSLA`,
    description: `A field whose value is a CSS HSLA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla().`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate strings as HSLA colors but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string',
    },
});
