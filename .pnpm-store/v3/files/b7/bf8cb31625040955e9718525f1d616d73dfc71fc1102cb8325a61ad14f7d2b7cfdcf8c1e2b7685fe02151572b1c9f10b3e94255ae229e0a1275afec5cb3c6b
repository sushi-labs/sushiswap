import { asArray } from '@graphql-tools/utils';
export function normalizePointers(unnormalizedPointerOrPointers) {
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
    for (const rawPointer of asArray(unnormalizedPointerOrPointers)) {
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
