"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLHexColorCode = exports.GraphQLHexColorCodeConfig = void 0;
const graphql_1 = require("graphql");
const HEX_COLOR_CODE = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;
const validate = (value) => {
    if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
    }
    if (!HEX_COLOR_CODE.test(value)) {
        throw new TypeError(`Value is not a valid HexColorCode: ${value}`);
    }
    return value;
};
const specifiedByURL = 'https://en.wikipedia.org/wiki/Web_colors';
exports.GraphQLHexColorCodeConfig = {
    name: `HexColorCode`,
    description: `A field whose value is a hex color code: https://en.wikipedia.org/wiki/Web_colors.`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== graphql_1.Kind.STRING) {
            throw new graphql_1.GraphQLError(`Can only validate strings as hex color codes but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    specifiedByURL,
    specifiedByUrl: specifiedByURL,
    extensions: {
        codegenScalarType: 'string',
    },
};
exports.GraphQLHexColorCode = 
/*#__PURE__*/ new graphql_1.GraphQLScalarType(exports.GraphQLHexColorCodeConfig);
