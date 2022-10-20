"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePointers = void 0;
const utils_1 = require("@graphql-tools/utils");
function normalizePointers(unnormalizedPointerOrPointers) {
    const ignore = [];
    const pointerOptionMap = {};
    const handlePointer = (rawPointer, options = {}) => {
        if (rawPointer.startsWith('!')) {
            ignore.push(rawPointer.replace('!', ''));
        }
        else {
            pointerOptionMap[rawPointer] = options;
        }
    };
    for (const rawPointer of (0, utils_1.asArray)(unnormalizedPointerOrPointers)) {
        if (typeof rawPointer === 'string') {
            handlePointer(rawPointer);
        }
        else if (typeof rawPointer === 'object') {
            for (const [path, options] of Object.entries(rawPointer)) {
                handlePointer(path, options);
            }
        }
        else {
            throw new Error(`Invalid pointer '${rawPointer}'.`);
        }
    }
    return { ignore, pointerOptionMap };
}
exports.normalizePointers = normalizePointers;
