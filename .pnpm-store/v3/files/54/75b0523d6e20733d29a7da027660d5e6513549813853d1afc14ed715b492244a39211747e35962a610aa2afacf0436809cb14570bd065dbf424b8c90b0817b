"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSource = void 0;
const utils_1 = require("@graphql-tools/utils");
const filter_document_kind_js_1 = require("../filter-document-kind.js");
function parseSource({ partialSource, options, pointerOptionMap, addValidSource }) {
    if (partialSource) {
        const input = prepareInput({
            source: partialSource,
            options,
            pointerOptionMap,
        });
        parseSchema(input);
        parseRawSDL(input);
        if (input.source.document) {
            useKindsFilter(input);
            useComments(input);
            collectValidSources(input, addValidSource);
        }
    }
}
exports.parseSource = parseSource;
//
function prepareInput({ source, options, pointerOptionMap, }) {
    let specificOptions = {
        ...options,
    };
    if (source.location) {
        specificOptions = {
            ...specificOptions,
            ...pointerOptionMap[source.location],
        };
    }
    return { source: { ...source }, options: specificOptions };
}
function parseSchema(input) {
    if (input.source.schema) {
        input.source.rawSDL = (0, utils_1.printSchemaWithDirectives)(input.source.schema, input.options);
    }
}
function parseRawSDL(input) {
    if (input.source.rawSDL) {
        input.source.document = (0, utils_1.parseGraphQLSDL)(input.source.location, input.source.rawSDL, input.options).document;
    }
}
function useKindsFilter(input) {
    if (input.options.filterKinds) {
        input.source.document = (0, filter_document_kind_js_1.filterKind)(input.source.document, input.options.filterKinds);
    }
}
function useComments(input) {
    if (!input.source.rawSDL && input.source.document) {
        input.source.rawSDL = (0, utils_1.printWithComments)(input.source.document);
        (0, utils_1.resetComments)();
    }
}
function collectValidSources(input, addValidSource) {
    var _a;
    if (((_a = input.source.document) === null || _a === void 0 ? void 0 : _a.definitions) && input.source.document.definitions.length > 0) {
        addValidSource(input.source);
    }
}
