export function applySchemaTransforms(originalWrappingSchema, subschemaConfig, transformedSchema) {
    const schemaTransforms = subschemaConfig.transforms;
    if (schemaTransforms == null) {
        return originalWrappingSchema;
    }
    return schemaTransforms.reduce((schema, transform) => transform.transformSchema != null
        ? transform.transformSchema(schema, subschemaConfig, transformedSchema)
        : schema, originalWrappingSchema);
}
