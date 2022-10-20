import { StateCreator, StoreMutatorIdentifier } from '../vanilla';
declare type SubscribeWithSelector = <T extends object, Mps extends [StoreMutatorIdentifier, unknown][] = [], Mcs extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [
    ...Mps,
    ['zustand/subscribeWithSelector', never]
], Mcs>) => StateCreator<T, Mps, [['zustand/subscribeWithSelector', never], ...Mcs]>;
declare type Write<T extends object, U extends object> = Omit<T, keyof U> & U;
declare type Cast<T, U> = T extends U ? T : U;
declare type WithSelectorSubscribe<S> = S extends {
    getState: () => infer T;
} ? Write<S, StoreSubscribeWithSelector<Cast<T, object>>> : never;
declare module '../vanilla' {
    interface StoreMutators<S, A> {
        ['zustand/subscribeWithSelector']: WithSelectorSubscribe<S>;
    }
}
declare type StoreSubscribeWithSelector<T extends object> = {
    subscribe: {
        (listener: (selectedState: T, previousSelectedState: T) => void): () => void;
        <U>(selector: (state: T) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
            equalityFn?: (a: U, b: U) => boolean;
            fireImmediately?: boolean;
        }): () => void;
    };
};
export declare const subscribeWithSelector: SubscribeWithSelector;
export {};
