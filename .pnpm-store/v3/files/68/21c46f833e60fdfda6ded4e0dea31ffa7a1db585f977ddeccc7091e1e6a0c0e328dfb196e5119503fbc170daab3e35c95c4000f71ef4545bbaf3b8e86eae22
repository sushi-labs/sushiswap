import { StateCreator, StoreMutatorIdentifier } from '../vanilla';
declare type Write<T extends object, U extends object> = Omit<T, keyof U> & U;
declare type Cast<T, U> = T extends U ? T : U;
declare type Action = {
    type: unknown;
};
declare type ReduxState<A extends Action> = {
    dispatch: StoreRedux<A>['dispatch'];
};
declare type StoreRedux<A extends Action> = {
    dispatch: (a: A) => A;
    dispatchFromDevtools: true;
};
declare type WithRedux<S, A> = Write<Cast<S, object>, StoreRedux<Cast<A, Action>>>;
declare type Redux = <T extends object, A extends Action, Cms extends [StoreMutatorIdentifier, unknown][] = []>(reducer: (state: T, action: A) => T, initialState: T) => StateCreator<Write<T, ReduxState<A>>, Cms, [['zustand/redux', A]]>;
declare module '../vanilla' {
    interface StoreMutators<S, A> {
        'zustand/redux': WithRedux<S, A>;
    }
}
export declare const redux: Redux;
export {};
