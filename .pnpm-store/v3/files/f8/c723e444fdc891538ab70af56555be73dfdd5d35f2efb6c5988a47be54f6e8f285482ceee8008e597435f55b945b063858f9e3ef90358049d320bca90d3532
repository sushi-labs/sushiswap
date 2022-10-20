"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yogaDefaultFormatError = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
const yogaDefaultFormatError = (err, message, isDev) => {
    if (err instanceof graphql_1.GraphQLError) {
        if (err.originalError) {
            if (err.originalError.name === 'GraphQLError') {
                return err;
            }
            // Original error should be removed
            const extensions = {
                ...err.extensions,
            };
            if (isDev) {
                extensions.originalError = {
                    message: err.originalError.message,
                    stack: err.originalError.stack,
                };
            }
            return (0, utils_1.createGraphQLError)(message, {
                nodes: err.nodes,
                source: err.source,
                positions: err.positions,
                path: err.path,
                extensions,
            });
        }
        return err;
    }
    return (0, utils_1.createGraphQLError)(message, {
        extensions: {
            http: {
                status: 500,
            },
        },
    });
};
exports.yogaDefaultFormatError = yogaDefaultFormatError;
