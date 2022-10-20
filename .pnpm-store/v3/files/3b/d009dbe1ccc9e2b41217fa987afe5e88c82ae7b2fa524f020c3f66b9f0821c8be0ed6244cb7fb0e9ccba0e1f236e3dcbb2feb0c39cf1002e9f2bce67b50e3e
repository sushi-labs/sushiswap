import { makeExecutableSchema } from '@graphql-tools/schema';
import { isInterfaceType, Kind } from 'graphql';
const defaultRelayMergeConfig = {
    selectionSet: `{ id }`,
    fieldName: 'node',
    args: ({ id }) => ({ id }),
};
export function handleRelaySubschemas(subschemas, getTypeNameFromId) {
    const typeNames = [];
    for (const subschema of subschemas) {
        const nodeType = subschema.schema.getType('Node');
        if (nodeType) {
            if (!isInterfaceType(nodeType)) {
                throw new Error(`Node type should be an interface!`);
            }
            const implementations = subschema.schema.getPossibleTypes(nodeType);
            for (const implementedType of implementations) {
                typeNames.push(implementedType.name);
                subschema.merge = subschema.merge || {};
                subschema.merge[implementedType.name] = defaultRelayMergeConfig;
            }
        }
    }
    const relaySubschemaConfig = {
        schema: makeExecutableSchema({
            typeDefs: /* GraphQL */ `
        type Query {
          node(id: ID!): Node
        }
        interface Node {
          id: ID!
        }
        ${typeNames
                .map(typeName => `
          type ${typeName} implements Node {
            id: ID!
          }
        `)
                .join('\n')}
      `,
            resolvers: {
                Query: {
                    node: (_, { id }) => ({ id }),
                },
                Node: {
                    __resolveType: ({ id }, _, info) => {
                        var _a, _b, _c;
                        if (!getTypeNameFromId) {
                            const possibleTypeNames = new Set();
                            for (const fieldNode of info.fieldNodes) {
                                if ((_a = fieldNode.selectionSet) === null || _a === void 0 ? void 0 : _a.selections) {
                                    for (const selection of ((_b = fieldNode.selectionSet) === null || _b === void 0 ? void 0 : _b.selections) || []) {
                                        switch (selection.kind) {
                                            case Kind.FRAGMENT_SPREAD: {
                                                const fragment = info.fragments[selection.name.value];
                                                possibleTypeNames.add(fragment.typeCondition.name.value);
                                                break;
                                            }
                                            case Kind.INLINE_FRAGMENT: {
                                                const possibleTypeName = (_c = selection.typeCondition) === null || _c === void 0 ? void 0 : _c.name.value;
                                                if (possibleTypeName) {
                                                    possibleTypeNames.add(possibleTypeName);
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            if (possibleTypeNames.size !== 1) {
                                console.warn(`You need to define getTypeNameFromId as a parameter to handleRelaySubschemas or add a fragment for "node" operation with specific single type condition!`);
                            }
                            return [...possibleTypeNames][0] || typeNames[0];
                        }
                        return getTypeNameFromId(id);
                    },
                },
            },
        }),
    };
    subschemas.push(relaySubschemaConfig);
    return subschemas;
}
