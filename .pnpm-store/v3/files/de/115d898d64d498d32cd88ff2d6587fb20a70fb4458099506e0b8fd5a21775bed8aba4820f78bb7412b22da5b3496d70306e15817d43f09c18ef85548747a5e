import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';
export class RegularExpression extends GraphQLScalarType {
    constructor(name, regex, options = {}) {
        const errorMessage = options.errorMessage
            ? options.errorMessage
            : (r, v) => `Value does not match ${r}: ${v}`;
        super({
            name,
            description: options.description || `A field whose value matches ${regex}.`,
            serialize(value) {
                if (value != null && !regex.test(value.toString())) {
                    throw new TypeError(errorMessage(regex, value));
                }
                return value;
            },
            parseValue(value) {
                if (value != null && !regex.test(value === null || value === void 0 ? void 0 : value.toString())) {
                    throw new TypeError(errorMessage(regex, value));
                }
                return value;
            },
            parseLiteral(ast) {
                if (ast.kind === Kind.NULL) {
                    return null;
                }
                if (options.stringOnly && ast.kind !== Kind.STRING) {
                    throw new GraphQLError(`Can only validate strings as ${name} but got a: ${ast.kind}`);
                }
                if (!('value' in ast) || ast.kind === Kind.ENUM) {
                    throw new GraphQLError(`Can only validate primitive values as ${name} but got a: ${ast.kind}`);
                }
                if (ast.value != null && !regex.test(ast.value.toString())) {
                    throw new TypeError(errorMessage(regex, ast.value));
                }
                return ast.value;
            },
            extensions: {
                codegenScalarType: options.stringOnly
                    ? 'string'
                    : 'string | number | boolean',
            },
        });
    }
}
