import { parse, extendSchema, printIntrospectionSchema, printSchema, visit, buildASTSchema, print, } from 'graphql';
import { removeFederation, getCachedDocumentNodeFromSchema, } from '@graphql-codegen/plugin-helpers';
import { extname } from 'path';
export const plugin = async (schema, _documents, { commentDescriptions = false, includeDirectives = false, includeIntrospectionTypes = false, sort = false, federation, }) => {
    const transformedSchemaAndAst = transformSchemaAST(schema, { sort, federation, includeIntrospectionTypes });
    return [
        includeIntrospectionTypes ? printIntrospectionSchema(transformedSchemaAndAst.schema) : null,
        includeDirectives
            ? print(transformedSchemaAndAst.ast)
            : printSchema(transformedSchemaAndAst.schema, { commentDescriptions }),
    ]
        .filter(Boolean)
        .join('\n');
};
export const validate = async (_schema, _documents, _config, outputFile, allPlugins) => {
    const singlePlugin = allPlugins.length === 1;
    if (singlePlugin && extname(outputFile) !== '.graphql') {
        throw new Error(`Plugin "schema-ast" requires extension to be ".graphql"!`);
    }
};
export function transformSchemaAST(schema, config) {
    schema = config.federation ? removeFederation(schema) : schema;
    if (config.includeIntrospectionTypes) {
        // See: https://spec.graphql.org/June2018/#sec-Schema-Introspection
        const introspectionAST = parse(`
      extend type Query {
        __schema: __Schema!
        __type(name: String!): __Type
      }
    `);
        schema = extendSchema(schema, introspectionAST);
    }
    let ast = getCachedDocumentNodeFromSchema(schema);
    ast = config.disableDescriptions
        ? visit(ast, {
            leave: node => ({
                ...node,
                description: undefined,
            }),
        })
        : ast;
    schema = config.disableDescriptions ? buildASTSchema(ast) : schema;
    return {
        schema,
        ast,
    };
}
