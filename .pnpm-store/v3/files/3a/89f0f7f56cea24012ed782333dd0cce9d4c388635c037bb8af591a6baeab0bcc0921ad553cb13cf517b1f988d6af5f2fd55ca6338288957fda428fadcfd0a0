"use strict";
exports.__esModule = true;
var merge_js_1 = require("../merge.js");
describe('@corex/deepmerge', function () {
    test('simple object', function () {
        var obj1 = {
            a: 1,
            b: {
                c: 2
            }
        };
        var obj2 = {
            a: 2,
            b: {
                c: 4,
                d: 5
            }
        };
        expect((0, merge_js_1.merge)([obj1, obj2])).toStrictEqual({
            a: 2,
            b: {
                c: 4,
                d: 5
            }
        });
    });
    test('array', function () {
        var arr1 = {
            a: [1, 2, 3]
        };
        var arr2 = {
            a: [3, 4, 5]
        };
        expect((0, merge_js_1.merge)([arr1, arr2])).toStrictEqual({
            a: [1, 2, 3, 4, 5]
        });
    });
    test('complex object', function () {
        var obj1 = {
            a: 2,
            b: function (x, y) { return x + y; },
            c: [1, 2, 4],
            d: {
                e: [4, 5, 7]
            }
        };
        expect(obj1.b(7, 5)).toStrictEqual(12);
        var obj2 = {
            a: 10,
            b: function (x, y) { return x / y; },
            c: [20, 30],
            d: {
                e: [4, 7, 5],
                f: {
                    g: 'another'
                }
            }
        };
        var obj3 = {
            b: function (x, y) { return x * y; },
            c: [1, 2, 4],
            d: {
                e: [4, 7, 5]
            }
        };
        var result = (0, merge_js_1.merge)([obj1, obj2, obj3]);
        expect(result.b(7, 5)).toStrictEqual(35);
    });
    test('arrayMergeTypes: combine', function () {
        var obj1 = {
            a: [1, 2, 3]
        };
        var obj2 = {
            a: [1, 7, 6]
        };
        var obj3 = {
            a: [20, 40]
        };
        expect((0, merge_js_1.merge)([obj1, obj2, obj3])).toStrictEqual({
            a: [1, 2, 3, 7, 6, 20, 40]
        });
    });
    test('arrayMergeTypes: overwrite', function () {
        var obj1 = {
            a: [1, 2, 3],
            b: ['c', 'd'],
            c: {
                d: [1, 2]
            }
        };
        var obj2 = {
            a: [1, 7, 6],
            b: ['e', 'f'],
            c: {
                d: [9, 10]
            }
        };
        var obj3 = {
            a: [20, 40]
        };
        expect((0, merge_js_1.merge)([obj1, obj2, obj3], {
            arrayMergeType: 'overwrite'
        })).toStrictEqual({
            a: [20, 40],
            b: ['e', 'f'],
            c: {
                d: [9, 10]
            }
        });
    });
    test('arrayMergeType: custom', function () {
        var obj1 = {
            a: ['1', '2'],
            c: {
                d: [1000, 500]
            }
        };
        var obj2 = {
            a: ['4', '5'],
            c: {
                d: [60, 80]
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        var customMergeFn = function (_, __) { return 42; };
        expect((0, merge_js_1.merge)([obj1, obj2], {
            arrayMerge: customMergeFn
        })).toStrictEqual({
            a: 42,
            c: {
                d: 42
            }
        });
    });
});
