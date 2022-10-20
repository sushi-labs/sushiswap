import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';
const validate = (value) => {
    const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
    if (typeof parsed !== 'number' || Number.isNaN(parsed)) {
        throw new TypeError(`Value is not a number: ${value}`);
    }
    if (parsed === Infinity || parsed === -Infinity) {
        throw new TypeError(`Value is not a finite number: ${value}`);
    }
    if (parsed <= 0 || parsed > 65535) {
        throw new TypeError(`Value is not a valid TCP port: ${value}`);
    }
    return parsed;
};
export const GraphQLPort = 
/*#__PURE__*/ new GraphQLScalarType({
    name: `Port`,
    description: `A field whose value is a valid TCP port within the range of 0 to 65535: https://en.wikipedia.org/wiki/Transmission_Control_Protocol#TCP_ports`,
    serialize(value) {
        return validate(value);
    },
    parseValue(value) {
        return validate(value);
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.INT) {
            throw new GraphQLError(`Can only validate integers as TCP ports but got a: ${ast.kind}`);
        }
        return validate(ast.value);
    },
    extensions: {
        codegenScalarType: 'string | number',
    },
});
