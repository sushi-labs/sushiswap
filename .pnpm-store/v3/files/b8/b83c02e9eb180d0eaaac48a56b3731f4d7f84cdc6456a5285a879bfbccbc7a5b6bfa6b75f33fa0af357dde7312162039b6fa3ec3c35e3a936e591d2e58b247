import { merge } from '../merge.js';
describe('@corex/deepmerge', () => {
    test('simple object', () => {
        const obj1 = {
            a: 1,
            b: {
                c: 2,
            },
        };
        const obj2 = {
            a: 2,
            b: {
                c: 4,
                d: 5,
            },
        };
        expect(merge([obj1, obj2])).toStrictEqual({
            a: 2,
            b: {
                c: 4,
                d: 5,
            },
        });
    });
    test('array', () => {
        const arr1 = {
            a: [1, 2, 3],
        };
        const arr2 = {
            a: [3, 4, 5],
        };
        expect(merge([arr1, arr2])).toStrictEqual({
            a: [1, 2, 3, 4, 5],
        });
    });
    test('complex object', () => {
        const obj1 = {
            a: 2,
            b: (x, y) => x + y,
            c: [1, 2, 4],
            d: {
                e: [4, 5, 7],
            },
        };
        expect(obj1.b(7, 5)).toStrictEqual(12);
        const obj2 = {
            a: 10,
            b: (x, y) => x / y,
            c: [20, 30],
            d: {
                e: [4, 7, 5],
                f: {
                    g: 'another',
                },
            },
        };
        const obj3 = {
            b: (x, y) => x * y,
            c: [1, 2, 4],
            d: {
                e: [4, 7, 5],
            },
        };
        const result = merge([obj1, obj2, obj3]);
        expect(result.b(7, 5)).toStrictEqual(35);
    });
    test('arrayMergeTypes: combine', () => {
        const obj1 = {
            a: [1, 2, 3],
        };
        const obj2 = {
            a: [1, 7, 6],
        };
        const obj3 = {
            a: [20, 40],
        };
        expect(merge([obj1, obj2, obj3])).toStrictEqual({
            a: [1, 2, 3, 7, 6, 20, 40],
        });
    });
    test('arrayMergeTypes: overwrite', () => {
        const obj1 = {
            a: [1, 2, 3],
            b: ['c', 'd'],
            c: {
                d: [1, 2],
            },
        };
        const obj2 = {
            a: [1, 7, 6],
            b: ['e', 'f'],
            c: {
                d: [9, 10],
            },
        };
        const obj3 = {
            a: [20, 40],
        };
        expect(merge([obj1, obj2, obj3], {
            arrayMergeType: 'overwrite',
        })).toStrictEqual({
            a: [20, 40],
            b: ['e', 'f'],
            c: {
                d: [9, 10],
            },
        });
    });
    test('arrayMergeType: custom', () => {
        const obj1 = {
            a: ['1', '2'],
            c: {
                d: [1000, 500],
            },
        };
        const obj2 = {
            a: ['4', '5'],
            c: {
                d: [60, 80],
            },
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const customMergeFn = (_, __) => 42;
        expect(merge([obj1, obj2], {
            arrayMerge: customMergeFn,
        })).toStrictEqual({
            a: 42,
            c: {
                d: 42,
            },
        });
    });
});
