"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericSdkVisitor = exports.validate = exports.plugin = void 0;
const plugin_helpers_1 = require("@graphql-codegen/plugin-helpers");
const graphql_1 = require("graphql");
const path_1 = require("path");
const visitor_js_1 = require("./visitor.js");
Object.defineProperty(exports, "GenericSdkVisitor", { enumerable: true, get: function () { return visitor_js_1.GenericSdkVisitor; } });
const plugin = (schema, documents, config) => {
    const allAst = (0, graphql_1.concatAST)(documents.reduce((prev, v) => {
        return [...prev, v.document];
    }, []));
    const allFragments = [
        ...allAst.definitions.filter(d => d.kind === graphql_1.Kind.FRAGMENT_DEFINITION).map(fragmentDef => ({
            node: fragmentDef,
            name: fragmentDef.name.value,
            onType: fragmentDef.typeCondition.name.value,
            isExternal: false,
        })),
        ...(config.externalFragments || []),
    ];
    const visitor = new visitor_js_1.GenericSdkVisitor(schema, allFragments, config);
    const visitorResult = (0, plugin_helpers_1.oldVisit)(allAst, { leave: visitor });
    return {
        prepend: visitor.getImports(),
        content: [
            visitor.fragments,
            ...visitorResult.definitions.filter(t => typeof t === 'string'),
            visitor.sdkContent,
        ].join('\n'),
    };
};
exports.plugin = plugin;
const validate = async (schema, documents, config, outputFile) => {
    if ((0, path_1.extname)(outputFile) !== '.ts') {
        throw new Error(`Plugin "typescript-generic-sdk" requires extension to be ".ts"!`);
    }
};
exports.validate = validate;
