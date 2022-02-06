import create, { GetState, SetState, StoreApi, UseBoundStore } from "zustand";
import { createWeb3Slice, Web3Slice } from "./web3Slice";
import { useLayoutEffect } from "react";
import createContext from "zustand/context";

export type StoreState = Web3Slice;
export type StoreSlice<T> = (
  set: SetState<StoreState>,
  get: GetState<StoreState>
) => T;

let store: UseBoundStore<StoreState, StoreApi<StoreState>>;

const initialState = {};
const zustandContext = createContext<StoreState>();

export const Provider = zustandContext.Provider;
export const useStore = zustandContext.useStore;

export const initializeStore = (preloadedState = {}) => {
  return create<StoreState>((set, get) => ({
    ...initialState,
    ...preloadedState,
    ...createWeb3Slice(set, get),
  }));
};

export function useCreateStore(initialState = {}) {
  // For SSR & SSG, always use a new store.
  if (typeof window === "undefined") {
    return () => initializeStore(initialState);
  }

  // For CSR, always re-use same store.
  store = store ?? initializeStore(initialState);

  // And if initialState changes, then merge states in the next render cycle.
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

    if (initialState) {
      store.setState({
        ...store.getState(),
        ...initialState,
      });

      void subscribe();
    }
  }, [initialState]);

  return () => store;
}

export default useStore;
