"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
function validate(schema, data) {
    const isValid = ajv.compile(schema);
    if (!isValid(data)) {
        // TODO: better error message
        throw new Error('Invalid data');
    }
    return data;
}
exports.validate = validate;
//# sourceMappingURL=validation.js.map