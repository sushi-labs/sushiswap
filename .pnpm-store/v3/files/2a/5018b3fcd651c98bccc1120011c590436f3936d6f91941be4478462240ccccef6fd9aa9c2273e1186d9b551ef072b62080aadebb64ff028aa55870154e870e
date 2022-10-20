"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subschema = exports.isSubschema = void 0;
const applySchemaTransforms_js_1 = require("./applySchemaTransforms.js");
function isSubschema(value) {
    return Boolean(value.transformedSchema);
}
exports.isSubschema = isSubschema;
class Subschema {
    constructor(config) {
        var _a;
        this.schema = config.schema;
        this.executor = config.executor;
        this.batch = config.batch;
        this.batchingOptions = config.batchingOptions;
        this.createProxyingResolver = config.createProxyingResolver;
        this.transforms = (_a = config.transforms) !== null && _a !== void 0 ? _a : [];
        this.transformedSchema = (0, applySchemaTransforms_js_1.applySchemaTransforms)(this.schema, config);
        this.merge = config.merge;
    }
}
exports.Subschema = Subschema;
