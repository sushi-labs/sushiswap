import { base64Encode } from "../../internal/utils/base64Encode.js";
import { isObject } from "../utils/isObject.js";
/**
 * Parse custom_function options
 * @private
 * @param {object|*} customFunction a custom function object containing function_type and source values
 * @return {string|*} custom_function transformation string
 */
export function processCustomFunction(customFunction) {
    if (!isObject(customFunction)) {
        return customFunction;
    }
    if (customFunction.function_type === "remote") {
        const encodedSource = base64Encode(customFunction.source)
            .replace(/\+/g, '-') // Convert '+' to '-'
            .replace(/\//g, '_') // Convert '/' to '_'
            .replace(/=+$/, ''); // Remove ending '='
        return [customFunction.function_type, encodedSource].join(":");
    }
    return [customFunction.function_type, customFunction.source].join(":");
}
