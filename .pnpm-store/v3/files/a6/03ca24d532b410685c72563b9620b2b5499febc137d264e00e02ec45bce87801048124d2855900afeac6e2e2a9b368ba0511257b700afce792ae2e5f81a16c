"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computedDirectiveTransformer = void 0;
const utils_1 = require("@graphql-tools/utils");
const delegate_1 = require("@graphql-tools/delegate");
function computedDirectiveTransformer(computedDirectiveName) {
    return (subschemaConfig) => {
        const newSubschemaConfig = (0, delegate_1.cloneSubschemaConfig)(subschemaConfig);
        (0, utils_1.mapSchema)(subschemaConfig.schema, {
            [utils_1.MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName, schema) => {
                var _a, _b, _c, _d, _e;
                const mergeTypeConfig = (_a = newSubschemaConfig.merge) === null || _a === void 0 ? void 0 : _a[typeName];
                if (mergeTypeConfig == null) {
                    return undefined;
                }
                const computed = (_b = (0, utils_1.getDirective)(schema, fieldConfig, computedDirectiveName)) === null || _b === void 0 ? void 0 : _b[0];
                if (computed == null) {
                    return undefined;
                }
                const selectionSet = computed['fields'] != null ? `{ ${computed['fields']} }` : computed['selectionSet'];
                if (selectionSet == null) {
                    return undefined;
                }
                mergeTypeConfig.fields = (_c = mergeTypeConfig.fields) !== null && _c !== void 0 ? _c : {};
                mergeTypeConfig.fields[fieldName] = (_d = mergeTypeConfig.fields[fieldName]) !== null && _d !== void 0 ? _d : {};
                const mergeFieldConfig = mergeTypeConfig.fields[fieldName];
                mergeFieldConfig.selectionSet = (_e = mergeFieldConfig.selectionSet) !== null && _e !== void 0 ? _e : selectionSet;
                mergeFieldConfig.computed = true;
                return undefined;
            },
        });
        return newSubschemaConfig;
    };
}
exports.computedDirectiveTransformer = computedDirectiveTransformer;
