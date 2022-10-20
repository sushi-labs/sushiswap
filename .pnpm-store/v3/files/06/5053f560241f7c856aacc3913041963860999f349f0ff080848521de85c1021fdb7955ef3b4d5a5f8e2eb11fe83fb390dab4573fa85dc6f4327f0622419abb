"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyTreeFromPaths = exports.getProperties = exports.getProperty = exports.addProperty = void 0;
function addProperty(object, path, value) {
    const initialSegment = path[0];
    if (path.length === 1) {
        object[initialSegment] = value;
        return;
    }
    let field = object[initialSegment];
    if (field != null) {
        addProperty(field, path.slice(1), value);
        return;
    }
    if (typeof path[1] === 'string') {
        field = Object.create(null);
    }
    else {
        field = [];
    }
    addProperty(field, path.slice(1), value);
    object[initialSegment] = field;
}
exports.addProperty = addProperty;
function getProperty(object, path) {
    if (!path.length || object == null) {
        return object;
    }
    const newPath = path.slice();
    const key = newPath.shift();
    if (key == null) {
        return;
    }
    const prop = object[key];
    return getProperty(prop, newPath);
}
exports.getProperty = getProperty;
function getProperties(object, propertyTree) {
    if (object == null) {
        return object;
    }
    const newObject = Object.create(null);
    for (const key in propertyTree) {
        const subKey = propertyTree[key];
        if (subKey == null) {
            newObject[key] = object[key];
            continue;
        }
        const prop = object[key];
        newObject[key] = deepMap(prop, function deepMapFn(item) {
            return getProperties(item, subKey);
        });
    }
    return newObject;
}
exports.getProperties = getProperties;
function propertyTreeFromPaths(paths) {
    const propertyTree = Object.create(null);
    for (const path of paths) {
        addProperty(propertyTree, path, null);
    }
    return propertyTree;
}
exports.propertyTreeFromPaths = propertyTreeFromPaths;
function deepMap(arrayOrItem, fn) {
    if (Array.isArray(arrayOrItem)) {
        return arrayOrItem.map(nestedArrayOrItem => deepMap(nestedArrayOrItem, fn));
    }
    return fn(arrayOrItem);
}
