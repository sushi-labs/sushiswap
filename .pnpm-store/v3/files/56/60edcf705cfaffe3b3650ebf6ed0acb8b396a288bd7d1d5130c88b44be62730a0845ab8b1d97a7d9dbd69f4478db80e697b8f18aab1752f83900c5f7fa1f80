"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const transform_type_merging_1 = tslib_1.__importDefault(require("@graphql-mesh/transform-type-merging"));
class AutoTypeMergingTransform {
    constructor(options) {
        this.options = options;
    }
    transformSchema(schema, subschemaConfig) {
        const queryType = schema.getQueryType();
        const queryFields = queryType === null || queryType === void 0 ? void 0 : queryType.getFields();
        const typeMergingQueryFieldConfig = [];
        if (queryFields != null) {
            for (const queryFieldName in queryFields) {
                const queryField = queryFields[queryFieldName];
                if (queryField.args.some((arg) => arg.name === 'where')) {
                    typeMergingQueryFieldConfig.push({
                        queryFieldName,
                        keyField: 'id',
                        keyArg: 'where.id_in',
                    });
                }
            }
        }
        const typeMergingTransform = new transform_type_merging_1.default({
            ...this.options,
            config: {
                queryFields: typeMergingQueryFieldConfig,
            },
        });
        return typeMergingTransform.transformSchema(schema, subschemaConfig);
    }
}
exports.default = AutoTypeMergingTransform;
