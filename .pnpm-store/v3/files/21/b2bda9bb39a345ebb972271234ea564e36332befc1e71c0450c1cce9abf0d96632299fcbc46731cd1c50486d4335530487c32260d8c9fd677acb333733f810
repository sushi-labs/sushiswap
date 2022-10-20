import { oldVisit } from '@graphql-codegen/plugin-helpers';
import { concatAST, Kind } from 'graphql';
import { extname } from 'path';
import { GenericSdkVisitor } from './visitor.js';
export const plugin = (schema, documents, config) => {
    const allAst = concatAST(documents.reduce((prev, v) => {
        return [...prev, v.document];
    }, []));
    const allFragments = [
        ...allAst.definitions.filter(d => d.kind === Kind.FRAGMENT_DEFINITION).map(fragmentDef => ({
            node: fragmentDef,
            name: fragmentDef.name.value,
            onType: fragmentDef.typeCondition.name.value,
            isExternal: false,
        })),
        ...(config.externalFragments || []),
    ];
    const visitor = new GenericSdkVisitor(schema, allFragments, config);
    const visitorResult = oldVisit(allAst, { leave: visitor });
    return {
        prepend: visitor.getImports(),
        content: [
            visitor.fragments,
            ...visitorResult.definitions.filter(t => typeof t === 'string'),
            visitor.sdkContent,
        ].join('\n'),
    };
};
export const validate = async (schema, documents, config, outputFile) => {
    if (extname(outputFile) !== '.ts') {
        throw new Error(`Plugin "typescript-generic-sdk" requires extension to be ".ts"!`);
    }
};
export { GenericSdkVisitor };
