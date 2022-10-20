"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.merge = void 0;
var util_js_1 = require("./util.js");
var withDefaultOptions = function (options) {
    return __assign({ arrayMergeType: 'combine', arrayMerge: (0, util_js_1.getMergeFn)(options ? options.arrayMergeType : 'combine') }, options);
};
var merge = function (objects, options) {
    var opts = withDefaultOptions(options);
    return objects.reduce(function (prev, curr) {
        Object.keys(curr).forEach(function (key) {
            if (Array.isArray(prev[key]) && Array.isArray(curr[key])) {
                if (opts && opts.arrayMerge) {
                    prev[key] = opts.arrayMerge(prev[key], curr[key]);
                }
            }
            else if ((0, util_js_1.isObject)(prev[key]) && (0, util_js_1.isObject)(curr[key])) {
                prev[key] = (0, exports.merge)([prev[key], curr[key]], opts);
            }
            else {
                prev[key] = curr[key];
            }
        });
        return prev;
    }, {});
};
exports.merge = merge;
