import TransformObjectFields from './TransformObjectFields.js';
export default class FilterObjectFields {
    constructor(filter) {
        this.transformer = new TransformObjectFields((typeName, fieldName, fieldConfig) => filter(typeName, fieldName, fieldConfig) ? undefined : null);
    }
    transformSchema(originalWrappingSchema, subschemaConfig, transformedSchema) {
        return this.transformer.transformSchema(originalWrappingSchema, subschemaConfig, transformedSchema);
    }
}
