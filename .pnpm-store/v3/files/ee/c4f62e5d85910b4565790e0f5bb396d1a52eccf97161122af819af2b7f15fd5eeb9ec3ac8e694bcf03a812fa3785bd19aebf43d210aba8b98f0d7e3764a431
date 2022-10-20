export function safeJsonParse(value) {
    if (typeof value !== "string") {
        throw new Error(`Cannot safe json parse value of type ${typeof value}`);
    }
    try {
        return JSON.parse(value);
    }
    catch (_a) {
        return value;
    }
}
export function safeJsonStringify(value) {
    return typeof value === "string" ? value : JSON.stringify(value);
}
//# sourceMappingURL=index.js.map