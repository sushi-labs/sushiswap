"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stitchSchemas = void 0;
const graphql_1 = require("graphql");
const schema_1 = require("@graphql-tools/schema");
const delegate_1 = require("@graphql-tools/delegate");
const typeCandidates_js_1 = require("./typeCandidates.js");
const stitchingInfo_js_1 = require("./stitchingInfo.js");
const index_js_1 = require("./subschemaConfigTransforms/index.js");
const merge_1 = require("@graphql-tools/merge");
function stitchSchemas({ subschemas = [], types = [], typeDefs = [], onTypeConflict, mergeDirectives, mergeTypes = true, typeMergingOptions, subschemaConfigTransforms = [], resolvers = {}, inheritResolversFromInterfaces = false, resolverValidationOptions = {}, updateResolversInPlace = true, schemaExtensions, ...rest }) {
    const transformedSubschemas = [];
    const subschemaMap = new Map();
    const originalSubschemaMap = new Map();
    for (const subschema of subschemas) {
        for (const transformedSubschemaConfig of applySubschemaConfigTransforms(subschemaConfigTransforms, subschema, subschemaMap, originalSubschemaMap)) {
            transformedSubschemas.push(transformedSubschemaConfig);
        }
    }
    const directiveMap = Object.create(null);
    for (const directive of graphql_1.specifiedDirectives) {
        directiveMap[directive.name] = directive;
    }
    const schemaDefs = Object.create(null);
    const [typeCandidates, rootTypeNameMap, extensions] = (0, typeCandidates_js_1.buildTypeCandidates)({
        subschemas: transformedSubschemas,
        originalSubschemaMap,
        types,
        typeDefs: typeDefs || [],
        parseOptions: rest,
        directiveMap,
        schemaDefs,
        mergeDirectives,
    });
    let stitchingInfo = (0, stitchingInfo_js_1.createStitchingInfo)(subschemaMap, typeCandidates, mergeTypes);
    const { typeMap: newTypeMap, directives: newDirectives } = (0, typeCandidates_js_1.buildTypes)({
        typeCandidates,
        directives: Object.values(directiveMap),
        stitchingInfo,
        rootTypeNames: Object.values(rootTypeNameMap),
        onTypeConflict,
        mergeTypes,
        typeMergingOptions,
    });
    let schema = new graphql_1.GraphQLSchema({
        query: newTypeMap[rootTypeNameMap.query],
        mutation: newTypeMap[rootTypeNameMap.mutation],
        subscription: newTypeMap[rootTypeNameMap.subscription],
        types: Object.values(newTypeMap),
        directives: newDirectives,
        astNode: schemaDefs.schemaDef,
        extensionASTNodes: schemaDefs.schemaExtensions,
        extensions: null,
    });
    for (const extension of extensions) {
        schema = (0, graphql_1.extendSchema)(schema, extension, {
            commentDescriptions: true,
        });
    }
    // We allow passing in an array of resolver maps, in which case we merge them
    const resolverMap = (0, merge_1.mergeResolvers)(resolvers);
    const finalResolvers = inheritResolversFromInterfaces
        ? (0, schema_1.extendResolversFromInterfaces)(schema, resolverMap)
        : resolverMap;
    stitchingInfo = (0, stitchingInfo_js_1.completeStitchingInfo)(stitchingInfo, finalResolvers, schema);
    schema = (0, schema_1.addResolversToSchema)({
        schema,
        defaultFieldResolver: delegate_1.defaultMergedResolver,
        resolvers: finalResolvers,
        resolverValidationOptions,
        inheritResolversFromInterfaces: false,
        updateResolversInPlace,
    });
    const resolverValidationOptionsEntries = Object.entries(resolverValidationOptions);
    if (resolverValidationOptionsEntries.length > 0 && resolverValidationOptionsEntries.some(([, o]) => o !== 'ignore')) {
        (0, schema_1.assertResolversPresent)(schema, resolverValidationOptions);
    }
    (0, stitchingInfo_js_1.addStitchingInfo)(schema, stitchingInfo);
    if (schemaExtensions) {
        if (Array.isArray(schemaExtensions)) {
            schemaExtensions = (0, merge_1.mergeExtensions)(schemaExtensions);
        }
        (0, merge_1.applyExtensions)(schema, schemaExtensions);
    }
    return schema;
}
exports.stitchSchemas = stitchSchemas;
const subschemaConfigTransformerPresets = [
    index_js_1.isolateComputedFieldsTransformer,
    index_js_1.splitMergedTypeEntryPointsTransformer,
];
function applySubschemaConfigTransforms(subschemaConfigTransforms, subschemaOrSubschemaConfig, subschemaMap, originalSubschemaMap) {
    let subschemaConfig;
    if ((0, delegate_1.isSubschemaConfig)(subschemaOrSubschemaConfig)) {
        subschemaConfig = subschemaOrSubschemaConfig;
    }
    else if (subschemaOrSubschemaConfig instanceof graphql_1.GraphQLSchema) {
        subschemaConfig = { schema: subschemaOrSubschemaConfig };
    }
    else {
        throw new TypeError('Received invalid input.');
    }
    const transformedSubschemaConfigs = subschemaConfigTransforms
        .concat(subschemaConfigTransformerPresets)
        .reduce((transformedSubschemaConfigs, subschemaConfigTransform) => transformedSubschemaConfigs.flatMap(ssConfig => subschemaConfigTransform(ssConfig)), [subschemaConfig]);
    const transformedSubschemas = transformedSubschemaConfigs.map(ssConfig => new delegate_1.Subschema(ssConfig));
    const baseSubschema = transformedSubschemas[0];
    subschemaMap.set(subschemaOrSubschemaConfig, baseSubschema);
    for (const subschema of transformedSubschemas) {
        originalSubschemaMap.set(subschema, subschemaOrSubschemaConfig);
    }
    return transformedSubschemas;
}
