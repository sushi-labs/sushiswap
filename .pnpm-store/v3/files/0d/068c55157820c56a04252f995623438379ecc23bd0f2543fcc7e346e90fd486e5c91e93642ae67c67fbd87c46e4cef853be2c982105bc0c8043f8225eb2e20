import { NoInfer, TableState, Updater } from './types';
export declare type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export declare type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export declare type Overwrite<T, U extends {
    [TKey in keyof T]?: any;
}> = Omit<T, keyof U> & U;
export declare type IfDefined<T, N> = 0 extends 1 & T ? N : T extends {} ? T : N;
export declare function functionalUpdate<T>(updater: Updater<T>, input: T): T;
export declare function noop(): void;
export declare function makeStateUpdater(key: keyof TableState, instance: unknown): (updater: Updater<any>) => void;
declare type AnyFunction = (...args: any) => any;
export declare function isFunction<T extends AnyFunction>(d: any): d is T;
export declare function flattenBy<TNode>(arr: TNode[], getChildren: (item: TNode) => TNode[]): TNode[];
export declare function memo<TDeps extends readonly any[], TResult>(getDeps: () => [...TDeps], fn: (...args: NoInfer<[...TDeps]>) => TResult, opts: {
    key: any;
    debug?: () => any;
    onChange?: (result: TResult) => void;
}): () => TResult;
export {};
