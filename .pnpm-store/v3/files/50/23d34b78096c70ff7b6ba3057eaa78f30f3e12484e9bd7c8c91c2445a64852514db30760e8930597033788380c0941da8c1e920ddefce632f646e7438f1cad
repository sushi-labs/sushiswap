"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stitchingDirectives = void 0;
const graphql_1 = require("graphql");
const defaultStitchingDirectiveOptions_js_1 = require("./defaultStitchingDirectiveOptions.js");
const stitchingDirectivesValidator_js_1 = require("./stitchingDirectivesValidator.js");
const stitchingDirectivesTransformer_js_1 = require("./stitchingDirectivesTransformer.js");
function stitchingDirectives(options = {}) {
    const finalOptions = {
        ...defaultStitchingDirectiveOptions_js_1.defaultStitchingDirectiveOptions,
        ...options,
    };
    const { keyDirectiveName, computedDirectiveName, mergeDirectiveName, canonicalDirectiveName } = finalOptions;
    const keyDirectiveTypeDefs = /* GraphQL */ `directive @${keyDirectiveName}(selectionSet: String!) on OBJECT`;
    const computedDirectiveTypeDefs = /* GraphQL */ `directive @${computedDirectiveName}(selectionSet: String!) on FIELD_DEFINITION`;
    const mergeDirectiveTypeDefs = /* GraphQL */ `directive @${mergeDirectiveName}(argsExpr: String, keyArg: String, keyField: String, key: [String!], additionalArgs: String) on FIELD_DEFINITION`;
    const canonicalDirectiveTypeDefs = /* GraphQL */ `directive @${canonicalDirectiveName} on OBJECT | INTERFACE | INPUT_OBJECT | UNION | ENUM | SCALAR | FIELD_DEFINITION | INPUT_FIELD_DEFINITION`;
    const keyDirective = new graphql_1.GraphQLDirective({
        name: keyDirectiveName,
        locations: ['OBJECT'],
        args: {
            selectionSet: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        },
    });
    const computedDirective = new graphql_1.GraphQLDirective({
        name: computedDirectiveName,
        locations: ['FIELD_DEFINITION'],
        args: {
            selectionSet: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        },
    });
    const mergeDirective = new graphql_1.GraphQLDirective({
        name: mergeDirectiveName,
        locations: ['FIELD_DEFINITION'],
        args: {
            argsExpr: { type: graphql_1.GraphQLString },
            keyArg: { type: graphql_1.GraphQLString },
            keyField: { type: graphql_1.GraphQLString },
            key: { type: new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)) },
            additionalArgs: { type: graphql_1.GraphQLString },
        },
    });
    const canonicalDirective = new graphql_1.GraphQLDirective({
        name: canonicalDirectiveName,
        locations: [
            'OBJECT',
            'INTERFACE',
            'INPUT_OBJECT',
            'UNION',
            'ENUM',
            'SCALAR',
            'FIELD_DEFINITION',
            'INPUT_FIELD_DEFINITION',
        ],
    });
    const allStitchingDirectivesTypeDefs = [
        keyDirectiveTypeDefs,
        computedDirectiveTypeDefs,
        mergeDirectiveTypeDefs,
        canonicalDirectiveTypeDefs,
    ].join('\n');
    return {
        keyDirectiveTypeDefs,
        computedDirectiveTypeDefs,
        mergeDirectiveTypeDefs,
        canonicalDirectiveTypeDefs,
        stitchingDirectivesTypeDefs: allStitchingDirectivesTypeDefs,
        allStitchingDirectivesTypeDefs,
        keyDirective,
        computedDirective,
        mergeDirective,
        canonicalDirective,
        allStitchingDirectives: [keyDirective, computedDirective, mergeDirective, canonicalDirective],
        stitchingDirectivesValidator: (0, stitchingDirectivesValidator_js_1.stitchingDirectivesValidator)(finalOptions),
        stitchingDirectivesTransformer: (0, stitchingDirectivesTransformer_js_1.stitchingDirectivesTransformer)(finalOptions),
    };
}
exports.stitchingDirectives = stitchingDirectives;
