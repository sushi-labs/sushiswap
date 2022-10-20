import { isObject, getMergeFn } from './util.js';
const withDefaultOptions = (options) => {
    return {
        arrayMergeType: 'combine',
        arrayMerge: getMergeFn(options ? options.arrayMergeType : 'combine'),
        ...options,
    };
};
export const merge = (objects, options) => {
    const opts = withDefaultOptions(options);
    return objects.reduce((prev, curr) => {
        Object.keys(curr).forEach((key) => {
            if (Array.isArray(prev[key]) && Array.isArray(curr[key])) {
                if (opts && opts.arrayMerge) {
                    prev[key] = opts.arrayMerge(prev[key], curr[key]);
                }
            }
            else if (isObject(prev[key]) && isObject(curr[key])) {
                prev[key] = merge([prev[key], curr[key]], opts);
            }
            else {
                prev[key] = curr[key];
            }
        });
        return prev;
    }, {});
};
