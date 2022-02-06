import create, { GetState, SetState } from "zustand";
import { createWeb3Slice, Web3Slice } from "./web3Slice";

export type StoreState = Web3Slice;
export type StoreSlice<T> = (
  set: SetState<StoreState>,
  get: GetState<StoreState>
) => T;

import { useLayoutEffect } from "react";
import createContext from "zustand/context";

let store: any;

const initialState = {};

const zustandContext = createContext();

export const Provider = zustandContext.Provider;
// An example of how to get types
/** @type {import('zustand/index').UseStore<typeof initialState>} */
export const useStore = zustandContext.useStore;

export const initializeStore = (preloadedState = {}) => {
  return create<StoreState>((set, get) => ({
    ...initialState,
    ...preloadedState,
    ...createWeb3Slice(set, get),
  }));
};

export function useCreateStore(initialState: any) {
  // For SSR & SSG, always use a new store.
  if (typeof window === "undefined") {
    return () => initializeStore(initialState);
  }

  // For CSR, always re-use same store.
  store = store ?? initializeStore(initialState);
  // And if initialState changes, then merge states in the next render cycle.
  //
  // eslint complaining "React Hooks must be called in the exact same order in every component render"
  // is ignorable as this code runs in same order in a given environment
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    const subscribe = async () => {
      const { getPriorityConnectorWithStore } = await import("../connectors");
      const priorityConnectorWithStore = getPriorityConnectorWithStore();
      // Sync web3React store to our own store
      // It's not pretty, but it works
      priorityConnectorWithStore[2].subscribe(() => {
        const { accounts, chainId, activating, error } =
          priorityConnectorWithStore[2].getState();
        store
          .getState()
          .setWeb3({ account: accounts?.[0], chainId, activating, error });
      });
    };

    if (initialState && store) {
      store.setState({
        ...store.getState(),
        ...initialState,
      });
      subscribe();
    }
  }, [initialState]);

  return () => store;
}

export default useStore;
