"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTypes = exports.buildTypeCandidates = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const typeFromAST_js_1 = tslib_1.__importDefault(require("./typeFromAST.js"));
const mergeCandidates_js_1 = require("./mergeCandidates.js");
const definitions_js_1 = require("./definitions.js");
const merge_1 = require("@graphql-tools/merge");
const wrap_1 = require("@graphql-tools/wrap");
function buildTypeCandidates({ subschemas, originalSubschemaMap, types, typeDefs, parseOptions, directiveMap, schemaDefs, mergeDirectives, }) {
    const extensions = [];
    const typeCandidates = Object.create(null);
    let schemaDef;
    let schemaExtensions = [];
    let document;
    let extraction;
    if ((typeDefs && !Array.isArray(typeDefs)) || (Array.isArray(typeDefs) && typeDefs.length)) {
        document = (0, merge_1.mergeTypeDefs)(typeDefs, parseOptions);
        extraction = (0, definitions_js_1.extractDefinitions)(document);
        schemaDef = extraction.schemaDefs[0];
        schemaExtensions = schemaExtensions.concat(extraction.schemaExtensions);
    }
    schemaDefs.schemaDef = schemaDef !== null && schemaDef !== void 0 ? schemaDef : schemaDefs.schemaDef;
    schemaDefs.schemaExtensions = schemaExtensions;
    const rootTypeNameMap = getRootTypeNameMap(schemaDefs);
    for (const subschema of subschemas) {
        const schema = (subschema.transformedSchema = (0, wrap_1.wrapSchema)(subschema));
        const rootTypeMap = (0, utils_1.getRootTypeMap)(schema);
        const rootTypes = (0, utils_1.getRootTypes)(schema);
        for (const [operation, rootType] of rootTypeMap.entries()) {
            addTypeCandidate(typeCandidates, rootTypeNameMap[operation], {
                type: rootType,
                subschema: originalSubschemaMap.get(subschema),
                transformedSubschema: subschema,
            });
        }
        if (mergeDirectives === true) {
            for (const directive of schema.getDirectives()) {
                directiveMap[directive.name] = directive;
            }
        }
        const originalTypeMap = schema.getTypeMap();
        for (const typeName in originalTypeMap) {
            const type = originalTypeMap[typeName];
            if ((0, graphql_1.isNamedType)(type) &&
                (0, graphql_1.getNamedType)(type).name.slice(0, 2) !== '__' &&
                !rootTypes.has(type)) {
                addTypeCandidate(typeCandidates, type.name, {
                    type,
                    subschema: originalSubschemaMap.get(subschema),
                    transformedSubschema: subschema,
                });
            }
        }
    }
    if (document != null && extraction != null) {
        for (const def of extraction.typeDefinitions) {
            const type = (0, typeFromAST_js_1.default)(def);
            if (!(0, graphql_1.isNamedType)(type)) {
                throw new Error(`Expected to get named typed but got ${(0, utils_1.inspect)(def)}`);
            }
            if (type != null) {
                addTypeCandidate(typeCandidates, type.name, { type });
            }
        }
        for (const def of extraction.directiveDefs) {
            const directive = (0, typeFromAST_js_1.default)(def);
            if (!(0, graphql_1.isDirective)(directive)) {
                throw new Error(`Expected to get directive type but got ${(0, utils_1.inspect)(def)}`);
            }
            directiveMap[directive.name] = directive;
        }
        if (extraction.extensionDefs.length > 0) {
            extensions.push({
                ...document,
                definitions: extraction.extensionDefs,
            });
        }
    }
    for (const type of types) {
        addTypeCandidate(typeCandidates, type.name, { type });
    }
    return [typeCandidates, rootTypeNameMap, extensions];
}
exports.buildTypeCandidates = buildTypeCandidates;
function getRootTypeNameMap({ schemaDef, schemaExtensions, }) {
    const rootTypeNameMap = {
        query: 'Query',
        mutation: 'Mutation',
        subscription: 'Subscription',
    };
    const allNodes = schemaExtensions.slice();
    if (schemaDef != null) {
        allNodes.unshift(schemaDef);
    }
    for (const node of allNodes) {
        if (node.operationTypes != null) {
            for (const operationType of node.operationTypes) {
                rootTypeNameMap[operationType.operation] = operationType.type.name.value;
            }
        }
    }
    return rootTypeNameMap;
}
function addTypeCandidate(typeCandidates, name, typeCandidate) {
    if (!(name in typeCandidates)) {
        typeCandidates[name] = [];
    }
    typeCandidates[name].push(typeCandidate);
}
function buildTypes({ typeCandidates, directives, stitchingInfo, rootTypeNames, onTypeConflict, mergeTypes, typeMergingOptions, }) {
    const typeMap = Object.create(null);
    for (const typeName in typeCandidates) {
        if (rootTypeNames.includes(typeName) ||
            (mergeTypes === true && !typeCandidates[typeName].some(candidate => (0, graphql_1.isSpecifiedScalarType)(candidate.type))) ||
            (typeof mergeTypes === 'function' && mergeTypes(typeCandidates[typeName], typeName)) ||
            (Array.isArray(mergeTypes) && mergeTypes.includes(typeName)) ||
            (stitchingInfo != null && typeName in stitchingInfo.mergedTypes)) {
            typeMap[typeName] = (0, mergeCandidates_js_1.mergeCandidates)(typeName, typeCandidates[typeName], typeMergingOptions);
        }
        else {
            const candidateSelector = onTypeConflict != null
                ? onTypeConflictToCandidateSelector(onTypeConflict)
                : (cands) => cands[cands.length - 1];
            typeMap[typeName] = candidateSelector(typeCandidates[typeName]).type;
        }
    }
    return (0, utils_1.rewireTypes)(typeMap, directives);
}
exports.buildTypes = buildTypes;
function onTypeConflictToCandidateSelector(onTypeConflict) {
    return cands => cands.reduce((prev, next) => {
        const type = onTypeConflict(prev.type, next.type, {
            left: {
                subschema: prev.subschema,
                transformedSubschema: prev.transformedSubschema,
            },
            right: {
                subschema: next.subschema,
                transformedSubschema: next.transformedSubschema,
            },
        });
        if (prev.type === type) {
            return prev;
        }
        else if (next.type === type) {
            return next;
        }
        return {
            schemaName: 'unknown',
            type,
        };
    });
}
