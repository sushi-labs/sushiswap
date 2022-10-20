"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSchemaSync = exports.loadSchema = void 0;
const load_typedefs_js_1 = require("./load-typedefs.js");
const graphql_1 = require("graphql");
const documents_js_1 = require("./documents.js");
const schema_1 = require("@graphql-tools/schema");
/**
 * Asynchronously loads a schema from the provided pointers.
 * @param schemaPointers Pointers to the sources to load the schema from
 * @param options Additional options
 */
async function loadSchema(schemaPointers, options) {
    var _a, _b;
    const sources = await (0, load_typedefs_js_1.loadTypedefs)(schemaPointers, {
        ...options,
        filterKinds: documents_js_1.OPERATION_KINDS,
    });
    const { schemas, typeDefs } = collectSchemasAndTypeDefs(sources);
    schemas.push(...((_a = options.schemas) !== null && _a !== void 0 ? _a : []));
    const mergeSchemasOptions = {
        ...options,
        schemas: schemas.concat((_b = options.schemas) !== null && _b !== void 0 ? _b : []),
        typeDefs,
    };
    const schema = (typeDefs === null || typeDefs === void 0 ? void 0 : typeDefs.length) === 0 && (schemas === null || schemas === void 0 ? void 0 : schemas.length) === 1 ? schemas[0] : (0, schema_1.mergeSchemas)(mergeSchemasOptions);
    if (options === null || options === void 0 ? void 0 : options.includeSources) {
        includeSources(schema, sources);
    }
    return options.sort ? (0, graphql_1.lexicographicSortSchema)(schema) : schema;
}
exports.loadSchema = loadSchema;
/**
 * Synchronously loads a schema from the provided pointers.
 * @param schemaPointers Pointers to the sources to load the schema from
 * @param options Additional options
 */
function loadSchemaSync(schemaPointers, options) {
    const sources = (0, load_typedefs_js_1.loadTypedefsSync)(schemaPointers, {
        filterKinds: documents_js_1.OPERATION_KINDS,
        ...options,
    });
    const { schemas, typeDefs } = collectSchemasAndTypeDefs(sources);
    const schema = (0, schema_1.mergeSchemas)({
        schemas,
        typeDefs,
        ...options,
    });
    if (options === null || options === void 0 ? void 0 : options.includeSources) {
        includeSources(schema, sources);
    }
    return options.sort ? (0, graphql_1.lexicographicSortSchema)(schema) : schema;
}
exports.loadSchemaSync = loadSchemaSync;
function includeSources(schema, sources) {
    const finalSources = [];
    for (const source of sources) {
        if (source.rawSDL) {
            finalSources.push(new graphql_1.Source(source.rawSDL, source.location));
        }
        else if (source.document) {
            finalSources.push(new graphql_1.Source((0, graphql_1.print)(source.document), source.location));
        }
    }
    schema.extensions = {
        ...schema.extensions,
        sources: finalSources,
        extendedSources: sources,
    };
}
function collectSchemasAndTypeDefs(sources) {
    const schemas = [];
    const typeDefs = [];
    for (const source of sources) {
        if (source.schema) {
            schemas.push(source.schema);
        }
        else if (source.document) {
            typeDefs.push(source.document);
        }
    }
    return {
        schemas,
        typeDefs,
    };
}
