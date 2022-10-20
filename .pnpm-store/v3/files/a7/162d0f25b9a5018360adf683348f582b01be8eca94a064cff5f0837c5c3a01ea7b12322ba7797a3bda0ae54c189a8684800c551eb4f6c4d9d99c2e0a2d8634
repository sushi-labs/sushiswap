// JSON stringifier that adjusts the result extensions while serialising
export function jsonStringifyResult(result) {
    return JSON.stringify(result, (key, value) => {
        if (key === 'extensions') {
            // omit http extensions
            const { http, ...extensions } = value;
            // remove empty extensions object
            if (Object.keys(extensions).length === 0) {
                return undefined;
            }
            return extensions;
        }
        return value;
    });
}
