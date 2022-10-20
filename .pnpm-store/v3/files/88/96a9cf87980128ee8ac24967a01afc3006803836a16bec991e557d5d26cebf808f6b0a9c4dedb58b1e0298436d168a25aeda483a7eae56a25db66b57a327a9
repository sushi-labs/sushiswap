"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySchemaTransforms = void 0;
function applySchemaTransforms(originalWrappingSchema, subschemaConfig, transformedSchema) {
    const schemaTransforms = subschemaConfig.transforms;
    if (schemaTransforms == null) {
        return originalWrappingSchema;
    }
    return schemaTransforms.reduce((schema, transform) => transform.transformSchema != null
        ? transform.transformSchema(schema, subschemaConfig, transformedSchema)
        : schema, originalWrappingSchema);
}
exports.applySchemaTransforms = applySchemaTransforms;
