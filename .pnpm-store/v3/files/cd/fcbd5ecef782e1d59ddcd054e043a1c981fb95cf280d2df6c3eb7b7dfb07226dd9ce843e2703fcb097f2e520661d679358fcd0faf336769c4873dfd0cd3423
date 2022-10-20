"use strict";
exports.__esModule = true;
exports.combineMerge = exports.overwriteMerge = void 0;
var deepmerge_1 = require("@corex/deepmerge");
var overwriteMerge = function () {
    var configs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        configs[_i] = arguments[_i];
    }
    return (0, deepmerge_1.merge)(configs, {
        arrayMergeType: 'overwrite'
    });
};
exports.overwriteMerge = overwriteMerge;
var combineMerge = function () {
    var configs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        configs[_i] = arguments[_i];
    }
    return (0, deepmerge_1.merge)(configs, {
        arrayMergeType: 'combine'
    });
};
exports.combineMerge = combineMerge;
