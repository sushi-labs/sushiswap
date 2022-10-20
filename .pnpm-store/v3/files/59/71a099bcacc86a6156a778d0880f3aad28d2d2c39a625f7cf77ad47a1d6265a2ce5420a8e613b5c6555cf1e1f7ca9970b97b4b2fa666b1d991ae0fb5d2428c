import { stitchSchemas, ValidationLevel } from '@graphql-tools/stitch';
import { extractResolvers } from '@graphql-mesh/utils';
import { federationToStitchingSDL, stitchingDirectives } from '@graphql-tools/stitching-directives';
import { addResolversToSchema } from '@graphql-tools/schema';
import { parse, buildSchema } from 'graphql';
import { PredefinedProxyOptions } from '@graphql-mesh/store';
import { AggregateError } from '@graphql-tools/utils';

const APOLLO_GET_SERVICE_DEFINITION_QUERY = /* GraphQL */ `
  query __ApolloGetServiceDefinition__ {
    _service {
      sdl
    }
  }
`;
class StitchingMerger {
    constructor(options) {
        this.name = 'stitching';
        this.logger = options.logger;
        this.store = options.store;
    }
    isFederatedSchema(schema) {
        const queryType = schema.getQueryType();
        if (queryType) {
            const queryFields = queryType.getFields();
            return '_service' in queryFields;
        }
        return false;
    }
    async replaceFederationSDLWithStitchingSDL(name, oldSchema, executor, stitchingDirectives) {
        const rawSourceLogger = this.logger.child(name);
        rawSourceLogger.debug(`Extracting existing resolvers if available`);
        const resolvers = extractResolvers(oldSchema);
        let newSchema = await this.store
            .proxy(`${name}_stitching`, PredefinedProxyOptions.GraphQLSchemaWithDiffing)
            .getWithSet(async () => {
            var _a;
            this.logger.debug(`Fetching Apollo Federated Service SDL for ${name}`);
            const sdlQueryResult = (await executor({
                document: parse(APOLLO_GET_SERVICE_DEFINITION_QUERY),
            }));
            if ((_a = sdlQueryResult.errors) === null || _a === void 0 ? void 0 : _a.length) {
                throw new AggregateError(sdlQueryResult.errors, `Failed on fetching Federated SDL for ${name}`);
            }
            const federationSdl = sdlQueryResult.data._service.sdl;
            this.logger.debug(`Generating Stitching SDL for ${name}`);
            const stitchingSdl = federationToStitchingSDL(federationSdl, stitchingDirectives);
            return buildSchema(stitchingSdl, {
                assumeValid: true,
                assumeValidSDL: true,
            });
        });
        rawSourceLogger.debug(`Adding existing resolvers back to the schema`);
        newSchema = addResolversToSchema({
            schema: newSchema,
            resolvers,
            updateResolversInPlace: true,
            resolverValidationOptions: {
                requireResolversToMatchSchema: 'ignore',
            },
        });
        return newSchema;
    }
    async getUnifiedSchema(context) {
        const { rawSources, typeDefs, resolvers } = context;
        this.logger.debug(`Stitching directives are being generated`);
        const defaultStitchingDirectives = stitchingDirectives({
            pathToDirectivesInExtensions: ['directives'],
        });
        this.logger.debug(`Checking if any of sources has federation metadata`);
        const subschemas = await Promise.all(rawSources.map(async (rawSource) => {
            if (rawSource.batch == null) {
                rawSource.batch = true;
            }
            if (this.isFederatedSchema(rawSource.schema)) {
                this.logger.debug(`${rawSource.name} has federated schema.`);
                rawSource.schema = await this.replaceFederationSDLWithStitchingSDL(rawSource.name, rawSource.schema, rawSource.executor, defaultStitchingDirectives);
            }
            rawSource.merge = defaultStitchingDirectives.stitchingDirectivesTransformer(rawSource).merge;
            return rawSource;
        }));
        this.logger.debug(`Stitching the source schemas`);
        const unifiedSchema = stitchSchemas({
            subschemas,
            typeDefs,
            resolvers,
            typeMergingOptions: {
                validationSettings: {
                    validationLevel: ValidationLevel.Off,
                },
            },
        });
        this.logger.debug(`sourceMap is being generated and attached to the unified schema`);
        unifiedSchema.extensions = unifiedSchema.extensions || {};
        Object.assign(unifiedSchema.extensions, {
            sourceMap: new Proxy({}, {
                get: (_, pKey) => {
                    if (pKey === 'get') {
                        return (rawSource) => {
                            const stitchingInfo = unifiedSchema.extensions.stitchingInfo;
                            for (const [subschemaConfig, subschema] of stitchingInfo.subschemaMap) {
                                if (subschemaConfig.name === rawSource.name) {
                                    return subschema.transformedSchema;
                                }
                            }
                            return undefined;
                        };
                    }
                    return () => {
                        throw new Error('Not Implemented');
                    };
                },
            }),
        });
        return {
            schema: unifiedSchema,
        };
    }
}

export default StitchingMerger;
