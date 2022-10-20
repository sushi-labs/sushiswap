export const isObject = (obj) => {
    if (typeof obj === 'object' && obj !== null) {
        if (typeof Object.getPrototypeOf === 'function') {
            const prototype = Object.getPrototypeOf(obj);
            return prototype === Object.prototype || prototype === null;
        }
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    return false;
};
export const overwriteMerge = (_, currArr) => currArr;
export const combineMerge = (prevArr, currArr) => {
    return [...new Set([...prevArr, ...currArr])];
};
export const getMergeFn = (type) => {
    switch (type) {
        case 'overwrite':
            return overwriteMerge;
        case 'combine':
        default:
            return combineMerge;
    }
};
