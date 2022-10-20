"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldsNotInSubschema = void 0;
const utils_1 = require("@graphql-tools/utils");
function getFieldsNotInSubschema(schema, stitchingInfo, gatewayType, subschemaType, fieldNodes, fragments, variableValues) {
    var _a;
    const subFieldNodesByResponseKey = (0, utils_1.collectSubFields)(schema, fragments, variableValues, gatewayType, fieldNodes);
    // TODO: Verify whether it is safe that extensions always exists.
    const fieldNodesByField = stitchingInfo === null || stitchingInfo === void 0 ? void 0 : stitchingInfo.fieldNodesByField;
    const fields = subschemaType.getFields();
    const fieldsNotInSchema = new Set();
    for (const [, subFieldNodes] of subFieldNodesByResponseKey) {
        const fieldName = subFieldNodes[0].name.value;
        if (!fields[fieldName]) {
            for (const subFieldNode of subFieldNodes) {
                fieldsNotInSchema.add(subFieldNode);
            }
        }
        const fieldNodesForField = (_a = fieldNodesByField === null || fieldNodesByField === void 0 ? void 0 : fieldNodesByField[gatewayType.name]) === null || _a === void 0 ? void 0 : _a[fieldName];
        if (fieldNodesForField) {
            for (const fieldNode of fieldNodesForField) {
                if (!fields[fieldNode.name.value]) {
                    fieldsNotInSchema.add(fieldNode);
                }
            }
        }
    }
    return Array.from(fieldsNotInSchema);
}
exports.getFieldsNotInSubschema = getFieldsNotInSubschema;
