declare type BaseStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export declare type ClientStorage = {
    getItem: <T>(key: string, defaultState?: T | null) => T | null;
    setItem: <T>(key: string, value: T | null) => void;
    removeItem: (key: string) => void;
};
export declare const noopStorage: BaseStorage;
export declare function createStorage({ storage, key: prefix, }: {
    storage: BaseStorage;
    key?: string;
}): ClientStorage;
export {};
