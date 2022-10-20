export declare function keyMap<T>(list: readonly T[], keyFn: (item: T) => string): Record<string, T>;
export declare function isEqual<T>(a: T, b: T): boolean;
export declare function isNotEqual<T>(a: T, b: T): boolean;
export declare function isVoid<T>(a: T): boolean;
export declare function diffArrays<T>(a: T[] | readonly T[], b: T[] | readonly T[]): T[];
export declare function compareLists<T extends {
    name: string;
}>(oldList: readonly T[], newList: readonly T[], callbacks?: {
    onAdded?(t: T): void;
    onRemoved?(t: T): void;
    onMutual?(t: {
        newVersion: T;
        oldVersion: T;
    }): void;
}): {
    added: T[];
    removed: T[];
    mutual: {
        newVersion: T;
        oldVersion: T;
    }[];
};
