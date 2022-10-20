import { merge } from '@corex/deepmerge';
export const overwriteMerge = (...configs) => {
    return merge(configs, {
        arrayMergeType: 'overwrite',
    });
};
export const combineMerge = (...configs) => {
    return merge(configs, {
        arrayMergeType: 'combine',
    });
};
