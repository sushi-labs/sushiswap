import { Mutate, StateCreator, StoreApi, StoreMutatorIdentifier } from './vanilla';
declare type ExtractState<S> = S extends {
    getState: () => infer T;
} ? T : never;
declare type WithReact<S extends StoreApi> = S & {
    getServerState?: () => ExtractState<S>;
};
export declare function useStore<S extends WithReact<StoreApi>>(api: S): ExtractState<S>;
export declare function useStore<S extends WithReact<StoreApi>, U>(api: S, selector: (state: ExtractState<S>) => U, equalityFn?: (a: U, b: U) => boolean): U;
export declare type UseBoundStore<S extends WithReact<StoreApi>> = {
    (): ExtractState<S>;
    <U>(selector: (state: ExtractState<S>) => U, equals?: (a: U, b: U) => boolean): U;
} & S;
declare type Create = {
    <T extends object, Mos extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [], Mos>): UseBoundStore<Mutate<StoreApi<T>, Mos>>;
    <T extends object>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [], Mos>) => UseBoundStore<Mutate<StoreApi<T>, Mos>>;
    <S extends StoreApi>(store: S): UseBoundStore<S>;
};
declare const create: Create;
export default create;
