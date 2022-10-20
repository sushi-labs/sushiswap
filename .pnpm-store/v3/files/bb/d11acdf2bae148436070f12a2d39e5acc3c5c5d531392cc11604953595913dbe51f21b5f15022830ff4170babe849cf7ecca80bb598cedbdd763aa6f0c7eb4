import { Kind, } from 'graphql';
export function extractDefinitions(ast) {
    const typeDefinitions = [];
    const directiveDefs = [];
    const schemaDefs = [];
    const schemaExtensions = [];
    const extensionDefs = [];
    for (const def of ast.definitions) {
        switch (def.kind) {
            case Kind.OBJECT_TYPE_DEFINITION:
            case Kind.INTERFACE_TYPE_DEFINITION:
            case Kind.INPUT_OBJECT_TYPE_DEFINITION:
            case Kind.UNION_TYPE_DEFINITION:
            case Kind.ENUM_TYPE_DEFINITION:
            case Kind.SCALAR_TYPE_DEFINITION:
                typeDefinitions.push(def);
                break;
            case Kind.DIRECTIVE_DEFINITION:
                directiveDefs.push(def);
                break;
            case Kind.SCHEMA_DEFINITION:
                schemaDefs.push(def);
                break;
            case Kind.SCHEMA_EXTENSION:
                schemaExtensions.push(def);
                break;
            case Kind.OBJECT_TYPE_EXTENSION:
            case Kind.INTERFACE_TYPE_EXTENSION:
            case Kind.INPUT_OBJECT_TYPE_EXTENSION:
            case Kind.UNION_TYPE_EXTENSION:
            case Kind.ENUM_TYPE_EXTENSION:
            case Kind.SCALAR_TYPE_EXTENSION:
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
