import { StateCreator, StoreApi, StoreMutatorIdentifier } from '../vanilla';
declare module '../vanilla' {
    interface StoreMutators<S, A> {
        'zustand/devtools': WithDevtools<S>;
    }
}
declare type Write<T extends object, U extends object> = Omit<T, keyof U> & U;
declare type Cast<T, U> = T extends U ? T : U;
declare type TakeTwo<T> = T extends [] ? [undefined, undefined] : T extends [unknown] ? [...a0: T, a1: undefined] : T extends [unknown?] ? [...a0: T, a1: undefined] : T extends [unknown, unknown] ? T : T extends [unknown, unknown?] ? T : T extends [unknown?, unknown?] ? T : T extends [infer A0, infer A1, ...unknown[]] ? [A0, A1] : T extends [infer A0, (infer A1)?, ...unknown[]] ? [A0, A1?] : T extends [(infer A0)?, (infer A1)?, ...unknown[]] ? [A0?, A1?] : never;
declare type WithDevtools<S> = Write<Cast<S, object>, StoreDevtools<S>>;
declare type StoreDevtools<S> = S extends {
    setState: (...a: infer A) => infer Sr;
} ? {
    setState(...a: [...a: TakeTwo<A>, actionType?: string | {
        type: unknown;
    }]): Sr;
} : never;
export interface DevtoolsOptions {
    enabled?: boolean;
    anonymousActionType?: string;
    name?: string;
    serialize?: boolean | {
        date?: boolean;
        regex?: boolean;
        undefined?: boolean;
        nan?: boolean;
        infinity?: boolean;
        error?: boolean;
        symbol?: boolean;
        map?: boolean;
        set?: boolean;
    };
}
declare type Devtools = <T extends object, Mps extends [StoreMutatorIdentifier, unknown][] = [], Mcs extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [...Mps, ['zustand/devtools', never]], Mcs>, devtoolsOptions?: DevtoolsOptions) => StateCreator<T, Mps, [['zustand/devtools', never], ...Mcs]>;
declare module '../vanilla' {
    interface StoreMutators<S, A> {
        'zustand/devtools': WithDevtools<S>;
    }
}
export declare type NamedSet<T extends object> = WithDevtools<StoreApi<T>>['setState'];
export declare const devtools: Devtools;
export {};
