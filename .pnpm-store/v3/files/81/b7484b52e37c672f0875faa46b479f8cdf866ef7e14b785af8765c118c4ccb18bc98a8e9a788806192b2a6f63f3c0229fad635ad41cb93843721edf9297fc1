"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDefinitions = void 0;
const graphql_1 = require("graphql");
function extractDefinitions(ast) {
    const typeDefinitions = [];
    const directiveDefs = [];
    const schemaDefs = [];
    const schemaExtensions = [];
    const extensionDefs = [];
    for (const def of ast.definitions) {
        switch (def.kind) {
            case graphql_1.Kind.OBJECT_TYPE_DEFINITION:
            case graphql_1.Kind.INTERFACE_TYPE_DEFINITION:
            case graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION:
            case graphql_1.Kind.UNION_TYPE_DEFINITION:
            case graphql_1.Kind.ENUM_TYPE_DEFINITION:
            case graphql_1.Kind.SCALAR_TYPE_DEFINITION:
                typeDefinitions.push(def);
                break;
            case graphql_1.Kind.DIRECTIVE_DEFINITION:
                directiveDefs.push(def);
                break;
            case graphql_1.Kind.SCHEMA_DEFINITION:
                schemaDefs.push(def);
                break;
            case graphql_1.Kind.SCHEMA_EXTENSION:
                schemaExtensions.push(def);
                break;
            case graphql_1.Kind.OBJECT_TYPE_EXTENSION:
            case graphql_1.Kind.INTERFACE_TYPE_EXTENSION:
            case graphql_1.Kind.INPUT_OBJECT_TYPE_EXTENSION:
            case graphql_1.Kind.UNION_TYPE_EXTENSION:
            case graphql_1.Kind.ENUM_TYPE_EXTENSION:
            case graphql_1.Kind.SCALAR_TYPE_EXTENSION:
                extensionDefs.push(def);
                break;
        }
    }
    return {
        typeDefinitions,
        directiveDefs,
        schemaDefs,
        schemaExtensions,
        extensionDefs,
    };
}
exports.extractDefinitions = extractDefinitions;
