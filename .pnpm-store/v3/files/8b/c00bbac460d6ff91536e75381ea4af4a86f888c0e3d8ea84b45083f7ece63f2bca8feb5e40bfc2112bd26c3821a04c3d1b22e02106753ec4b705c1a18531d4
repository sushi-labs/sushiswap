import { getNamedType, isNamedType, isSpecifiedScalarType, isDirective, } from 'graphql';
import { rewireTypes, getRootTypeMap, inspect, getRootTypes, } from '@graphql-tools/utils';
import typeFromAST from './typeFromAST.js';
import { mergeCandidates } from './mergeCandidates.js';
import { extractDefinitions } from './definitions.js';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { wrapSchema } from '@graphql-tools/wrap';
export function buildTypeCandidates({ subschemas, originalSubschemaMap, types, typeDefs, parseOptions, directiveMap, schemaDefs, mergeDirectives, }) {
    const extensions = [];
    const typeCandidates = Object.create(null);
    let schemaDef;
    let schemaExtensions = [];
    let document;
    let extraction;
    if ((typeDefs && !Array.isArray(typeDefs)) || (Array.isArray(typeDefs) && typeDefs.length)) {
        document = mergeTypeDefs(typeDefs, parseOptions);
        extraction = extractDefinitions(document);
        schemaDef = extraction.schemaDefs[0];
        schemaExtensions = schemaExtensions.concat(extraction.schemaExtensions);
    }
    schemaDefs.schemaDef = schemaDef !== null && schemaDef !== void 0 ? schemaDef : schemaDefs.schemaDef;
    schemaDefs.schemaExtensions = schemaExtensions;
    const rootTypeNameMap = getRootTypeNameMap(schemaDefs);
    for (const subschema of subschemas) {
        const schema = (subschema.transformedSchema = wrapSchema(subschema));
        const rootTypeMap = getRootTypeMap(schema);
        const rootTypes = getRootTypes(schema);
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
            if (isNamedType(type) &&
                getNamedType(type).name.slice(0, 2) !== '__' &&
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
            const type = typeFromAST(def);
            if (!isNamedType(type)) {
                throw new Error(`Expected to get named typed but got ${inspect(def)}`);
            }
            if (type != null) {
                addTypeCandidate(typeCandidates, type.name, { type });
            }
        }
        for (const def of extraction.directiveDefs) {
            const directive = typeFromAST(def);
            if (!isDirective(directive)) {
                throw new Error(`Expected to get directive type but got ${inspect(def)}`);
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
export function buildTypes({ typeCandidates, directives, stitchingInfo, rootTypeNames, onTypeConflict, mergeTypes, typeMergingOptions, }) {
    const typeMap = Object.create(null);
    for (const typeName in typeCandidates) {
        if (rootTypeNames.includes(typeName) ||
            (mergeTypes === true && !typeCandidates[typeName].some(candidate => isSpecifiedScalarType(candidate.type))) ||
            (typeof mergeTypes === 'function' && mergeTypes(typeCandidates[typeName], typeName)) ||
            (Array.isArray(mergeTypes) && mergeTypes.includes(typeName)) ||
            (stitchingInfo != null && typeName in stitchingInfo.mergedTypes)) {
            typeMap[typeName] = mergeCandidates(typeName, typeCandidates[typeName], typeMergingOptions);
        }
        else {
            const candidateSelector = onTypeConflict != null
                ? onTypeConflictToCandidateSelector(onTypeConflict)
                : (cands) => cands[cands.length - 1];
            typeMap[typeName] = candidateSelector(typeCandidates[typeName]).type;
        }
    }
    return rewireTypes(typeMap, directives);
}
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
