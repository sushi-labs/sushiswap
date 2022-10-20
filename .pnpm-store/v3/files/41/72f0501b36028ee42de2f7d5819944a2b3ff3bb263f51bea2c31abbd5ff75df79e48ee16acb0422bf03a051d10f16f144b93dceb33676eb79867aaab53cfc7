import { ReactNode } from 'react';
import { StoreApi } from 'zustand';
declare type UseContextStore<S extends StoreApi> = {
    (): ExtractState<S>;
    <U>(selector: (state: ExtractState<S>) => U, equalityFn?: (a: U, b: U) => boolean): U;
};
declare type ExtractState<S> = S extends {
    getState: () => infer T;
} ? T : never;
declare type WithoutCallSignature<T> = {
    [K in keyof T]: T[K];
};
declare function createContext<S extends StoreApi>(): {
    Provider: ({ createStore, children, }: {
        createStore: () => S;
        children: ReactNode;
    }) => import("react").FunctionComponentElement<import("react").ProviderProps<S | undefined>>;
    useStore: UseContextStore<S>;
    useStoreApi: () => WithoutCallSignature<S>;
};
export default createContext;
