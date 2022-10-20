'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const utils = require('@graphql-mesh/utils');
const schema = require('@graphql-tools/schema');
const utils$1 = require('@graphql-tools/utils');
const graphql = require('graphql');
const StitchingMerger = _interopDefault(require('@graphql-mesh/merger-stitching'));

class BareMerger {
    constructor(options) {
        this.options = options;
        this.name = 'bare';
    }
    handleSingleWrappedExtendedSource(mergerCtx) {
        // switch to stitching merger
        this.name = 'stitching';
        this.options.logger.debug(`Switching to Stitching merger due to the transforms and additional resolvers`);
        this.options.logger = this.options.logger.child('Stitching Proxy');
        this.stitchingMerger = this.stitchingMerger || new StitchingMerger(this.options);
        return this.stitchingMerger.getUnifiedSchema(mergerCtx);
    }
    handleSingleRegularSource({ rawSources: [rawSource], typeDefs, resolvers }) {
        let schema$1 = rawSource.schema;
        if (typeDefs.length > 0 || utils$1.asArray(resolvers).length > 0) {
            for (const typeDef of typeDefs) {
                schema$1 = graphql.extendSchema(schema$1, typeDef);
            }
            for (const resolversObj of utils$1.asArray(resolvers)) {
                schema.addResolversToSchema({
                    schema: schema$1,
                    resolvers: resolversObj,
                    updateResolversInPlace: true,
                });
            }
        }
        this.options.logger.debug(`Attaching a dummy sourceMap to the final schema`);
        schema$1.extensions = schema$1.extensions || {};
        Object.defineProperty(schema$1.extensions, 'sourceMap', {
            get: () => {
                return {
                    get() {
                        // We should return a version of the schema only with the source-level transforms
                        // But we should prevent the existing schema from being mutated internally
                        const nonExecutableSchema = utils$1.mapSchema(schema$1);
                        return utils.applySchemaTransforms(nonExecutableSchema, rawSource, nonExecutableSchema, rawSource.transforms);
                    },
                };
            },
        });
        return {
            ...rawSource,
            schema: schema$1,
        };
    }
    async getUnifiedSchema({ rawSources, typeDefs, resolvers }) {
        var _a;
        if (rawSources.length === 1) {
            if ((rawSources[0].executor || ((_a = rawSources[0].transforms) === null || _a === void 0 ? void 0 : _a.length)) &&
                (typeDefs.length > 0 || utils$1.asArray(resolvers).length > 0)) {
                return this.handleSingleWrappedExtendedSource({ rawSources, typeDefs, resolvers });
            }
            return this.handleSingleRegularSource({ rawSources, typeDefs, resolvers });
        }
        const sourceMap = new Map();
        this.options.logger.debug(`Applying transforms for each source`);
        const schemas = rawSources.map(source => {
            let schema = source.schema;
            let sourceLevelSchema = source.schema;
            schema = utils.applySchemaTransforms(schema, undefined, schema, source.transforms);
            // After that step, it will be considered as root level schema
            sourceLevelSchema = schema;
            sourceMap.set(source, sourceLevelSchema);
            return schema;
        });
        this.options.logger.debug(`Merging sources`);
        const unifiedSchema = schema.mergeSchemas({
            schemas,
            typeDefs,
            resolvers,
        });
        this.options.logger.debug(`Attaching sources to the unified schema`);
        unifiedSchema.extensions = unifiedSchema.extensions || {};
        Object.defineProperty(unifiedSchema.extensions, 'sourceMap', {
            get: () => sourceMap,
        });
        return {
            schema: unifiedSchema,
        };
    }
}

module.exports = BareMerger;
