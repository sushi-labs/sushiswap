"use strict";
exports.__esModule = true;
var array_js_1 = require("../array.js");
describe('next-sitemap/array', function () {
    test('toChunks', function () {
        var inputArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var chunkSize = 3;
        var chunks = (0, array_js_1.toChunks)(inputArray, chunkSize);
        expect(chunks).toStrictEqual([
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [9, 10],
        ]);
    });
    test('toArray', function () {
        expect((0, array_js_1.toArray)('hello')).toStrictEqual(['hello']);
        expect((0, array_js_1.toArray)(['hello', 'world'])).toStrictEqual(['hello', 'world']);
    });
    test('removeFromArray', function () {
        expect((0, array_js_1.removeFromArray)([1, 2, 3], [2])).toStrictEqual([1, 3]);
        expect((0, array_js_1.removeFromArray)([1, 2, 3], [2, 3, 4])).toStrictEqual([1]);
    });
    test('removeIfMatchPattern', function () {
        expect((0, array_js_1.removeIfMatchPattern)(['/hello', '/world', '/something'], ['/hello*', '/som*'])).toStrictEqual(['/world']);
    });
});
