"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
class AddSourceNameTransform {
    constructor({ apiName }) {
        this.noWrap = true;
        this.apiName = apiName;
    }
    transformSchema(schema) {
        return (0, utils_1.mapSchema)(schema, {
            [utils_1.MapperKind.OBJECT_TYPE]: (type) => {
                const typeConfig = type.toConfig();
                typeConfig.fields.sourceName = {
                    type: graphql_1.GraphQLString,
                    resolve: () => this.apiName,
                };
                return new graphql_1.GraphQLObjectType(typeConfig);
            },
        });
    }
}
exports.default = AddSourceNameTransform;
