import { Draft } from 'immer';
import { StateCreator, StoreMutatorIdentifier } from '../vanilla';
declare type Immer = <T extends object, Mps extends [StoreMutatorIdentifier, unknown][] = [], Mcs extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [...Mps, ['zustand/immer', never]], Mcs>) => StateCreator<T, Mps, [['zustand/immer', never], ...Mcs]>;
declare module '../vanilla' {
    interface StoreMutators<S, A> {
        ['zustand/immer']: WithImmer<S>;
    }
}
declare type Write<T extends object, U extends object> = Omit<T, keyof U> & U;
declare type Cast<T, U> = T extends U ? T : U;
declare type SkipTwo<T> = T extends [] ? [] : T extends [unknown] ? [] : T extends [unknown?] ? [] : T extends [unknown, unknown, ...infer A] ? A : T extends [unknown, unknown?, ...infer A] ? A : T extends [unknown?, unknown?, ...infer A] ? A : never;
declare type WithImmer<S> = Write<Cast<S, object>, StoreImmer<S>>;
declare type StoreImmer<S> = S extends {
    getState: () => infer T;
    setState: infer SetState;
} ? SetState extends (...a: infer A) => infer Sr ? {
    setState(nextStateOrUpdater: T | Partial<T> | ((state: Draft<T>) => void), shouldReplace?: boolean | undefined, ...a: SkipTwo<A>): Sr;
} : never : never;
export declare const immer: Immer;
export {};
