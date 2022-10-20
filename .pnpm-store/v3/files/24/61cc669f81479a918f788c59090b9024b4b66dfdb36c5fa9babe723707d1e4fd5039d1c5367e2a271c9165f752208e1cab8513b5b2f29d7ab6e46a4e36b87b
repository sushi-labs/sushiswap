import { JsonRpcSchema, JsonRpcSchemaMap, JsonRpcPayload } from "./jsonrpc";
export interface JsonRpcValidationResult {
    valid: boolean;
    error?: string;
}
export interface JsonRpcValidationValid extends JsonRpcValidationResult {
    valid: true;
}
export interface JsonRpcValidationInvalid extends JsonRpcValidationResult {
    valid: false;
    error: string;
}
export declare type JsonRpcValidation = JsonRpcValidationValid | JsonRpcValidationInvalid;
export declare abstract class IJsonRpcValidator {
    schemas: JsonRpcSchemaMap;
    constructor(schemas: JsonRpcSchemaMap);
    abstract isSupported(method: string): boolean;
    abstract getSchema(method: string): JsonRpcSchema;
    abstract validate(payload: JsonRpcPayload, method?: string): JsonRpcValidation;
}
//# sourceMappingURL=validator.d.ts.map