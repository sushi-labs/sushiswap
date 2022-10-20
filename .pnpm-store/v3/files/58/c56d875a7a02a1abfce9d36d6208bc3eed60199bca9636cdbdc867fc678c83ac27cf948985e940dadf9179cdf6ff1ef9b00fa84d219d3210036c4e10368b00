import { pruneSchema } from '@graphql-tools/utils';
export default class PruneTypes {
    constructor(options = {}) {
        this.options = options;
    }
    transformSchema(originalWrappingSchema, _subschemaConfig, _transformedSchema) {
        return pruneSchema(originalWrappingSchema, this.options);
    }
}
