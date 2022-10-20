import { Kind, GraphQLError, GraphQLScalarType, } from 'graphql';
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
export const GraphQLHSLConfig = 
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
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Can only validate strings as HSL colors but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
    },
};
export const GraphQLHSL = 
/*#__PURE__*/ new GraphQLScalarType(GraphQLHSLConfig);
